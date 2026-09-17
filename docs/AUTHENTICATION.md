# Authentication

Who the visitor is, how the front-end proves it to Strapi, and what protects each route.

---

## 1. The model in one line

Strapi's `users-permissions` plugin issues a **stateless JWT** — there is no session store
and no session id. The token never reaches the browser: it lives in an httpOnly cookie on
the Next.js domain, and only the Next server attaches it as `Authorization: Bearer …` on
its calls to Strapi.

```
browser  ──cookie: jwt (httpOnly)──▶  Next.js server  ──Authorization: Bearer <jwt>──▶  Strapi
```

Consequences worth remembering: no client code can read the token (no `localStorage`, no
`document.cookie`), every authenticated call is server-side, and **logging out cannot
revoke anything** — the token stays valid at Strapi until it expires.

---

## 2. Cookies

Both are set in `setAuthCookies()` — `client/src/data/auth-actions.ts`. Names come from
`client/src/data/auth-guard.ts` (`AUTH_COOKIE`, `USER_EMAIL_COOKIE`), never as literals.

| Cookie       | Holds                                     | Flags                                                                                    |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `jwt`        | the Strapi JWT - not the client app token | httpOnly (cant get read by js), `secure` in production, `sameSite=lax`, 7 days, `path=/` |
| `user_email` | the address shown in the header           | same                                                                                     |

The cookie lives **7 days**; the JWT's own expiry is Strapi's default (**30 days** — no
`jwt.expiresIn` override in `server/config/plugins.ts`). The cookie expiring first is the
safe direction.

CSRF: `sameSite=lax` plus Next's built-in Origin check on Server Actions. No CSRF token.

---

## 3. The flows

| Flow                    | Entry point                                   | Strapi endpoint                                         |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Register                | `authAction` (mode `register`)                | `POST /api/auth/local/register`                         |
| Login                   | `authAction` (mode `login`)                   | `POST /api/auth/local`                                  |
| Confirm e-mail          | `confirmEmailService`                         | `GET /api/auth/email-confirmation`                      |
| Forgot / reset password | `forgotPasswordAction`, `resetPasswordAction` | `/api/auth/forgot-password`, `/api/auth/reset-password` |
| Read own profile        | `getUserProfileResult`                        | `GET /api/users/me`                                     |
| Update own profile      | `updateProfileAction`                         | `PUT /api/users/:id`                                    |
| Logout                  | `logoutAction`                                | _(none — cookies deleted)_                              |

All of them are Server Actions or server modules; the browser never calls Strapi directly.
reCAPTCHA v3 gates every public auth form (skipped in dev, see `verifyRecaptcha`).

---

## 4. Route-level guard

`client/src/data/auth-guard.ts` owns the whole policy:

```ts
export const PROTECTED_ROUTES: readonly string[] = [Route.Profile];
```

`client/src/proxy.ts` (Next 16's name for middleware) checks it **before** the locale
rewrite, so nothing renders without a token. Routes are matched in _physical_ form, so
`/profil`, `/en/profile` and `/hu/profile` are all covered by the single entry above.

| Request to a protected route          | Result                                               |
| ------------------------------------- | ---------------------------------------------------- |
| no `jwt` cookie                       | 307 → login page of that locale                      |
| `jwt` whose `exp` has passed          | 307 → login `?session=expired`, both cookies cleared |
| `jwt` that parses and has not expired | request proceeds                                     |

`isJwtExpired()` reads the `exp` claim **without verifying the signature** — the secret
lives in Strapi and the edge runtime cannot check it. That is sound here: the decision is
only "is it worth rendering a page whose data will not load". A forged token gets rejected
by Strapi on the next API call, which is the second layer:

**Strapi rejected the token** (secret rotated, user deleted or blocked). The proxy cannot
see this, so `app/[locale]/profile/page.tsx` handles it: `getUserProfileResult()` reports
`unauthorized` for a 401/403, and the page redirects to `/api/auth/session-expired`, which
clears the cookies and forwards to the login page. The detour through a Route Handler is
needed because **a Server Component may not write cookies**.

`error` (Strapi unreachable, 5xx) is deliberately _not_ treated as a dead token — an
outage must not sign everybody out.

### Adding a protected route

1. Add its `Route` member to `PROTECTED_ROUTES`.
2. Nothing else. Every locale, the expiry check and the redirect come with it.

Keep the page's own `if (!jwt) redirect(...)` as a safety net for renders that do not pass
through the proxy.

---

## 5. Authorization

**Strapi roles** (`users-permissions`): Public, Authenticated, and a custom **TestUser**.
The per-endpoint permission matrix lives in the Strapi admin, not in the repo.

On top of that, four enforcement points in code:

| Where                                           | What it enforces                                                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extensions/users-permissions/strapi-server.ts` | strips `role` from the body of `register` / `user.create` / `user.update`, so nobody can move themselves into TestUser; adds `role` back to `/api/users/me`, which does not populate it |
| `api/event-signup/controllers/event-signup.ts`  | `find` is overridden to return only the caller's own signups, ignoring any client-sent filter                                                                                           |
| `api/newsletter-signup` `…/me` routes           | declared `auth: false` and verify the Bearer token **by hand** (`resolveEmailFromJwt`)                                                                                                  |
| `middlewares/hide-disabled-content.ts`          | entries flagged `disabled` are visible only to TestUser or a full-access API token                                                                                                      |

`client/src/data/viewer.ts` is the front-end counterpart: it forwards the JWT on content
reads **only for test users**, because the Authenticated role does not necessarily hold the
same read permissions as Public.

---

## 6. Known limits

- **No revocation.** Logout only deletes cookies. A copied token works until it expires.
- **Manual auth on the newsletter `…/me` routes.** They bypass Strapi's permission system;
  a new handler added there that forgets `resolveEmailFromJwt` is silently public.
- **No return-to-page after login.** The guard sends the visitor to the login page and the
  login sends them to the profile; the originally requested URL is not carried over.
- **`getUserProfileService` still flattens every failure to `null`.** Callers that need to
  tell "rejected" from "unreachable" use `getUserProfileResult` instead.
