import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/data/auth-actions";
import { SubmitButtonNoSSR } from "@/components/SubmitButtonNoSSR";
import { getUserEventSignupsLoader, getUserProfilePageLoader, type PaymentStatus } from "@/data/loaders";
import { ProfileForm } from "./ProfileForm";
import { NewsletterPanel } from "./NewsletterPanel";
import { SignupDetailsToggle } from "./SignupDetailsToggle";
import { formatDate } from "@/utils/format-date";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import CustomChip from "@/components/custom-ui-components/custom-chip/custom-chip";
import { StrapiImage } from "@/components/StrapiImage";
import { ContentListHeadline } from "@/components/ContentListHeadline";
import { getTexts } from "@/i18n/texts";
import { getRequestLocale, localizedPath } from "@/data/locale";
import { toPublicPath, Route } from "@/i18n/config";
import { AUTH_COOKIE, sessionExpiredPath } from "@/data/auth-guard";

type PaymentStatusChip = Record<
  PaymentStatus,
  { label: string; color: "success" | "warning" | "error" | "info" }
>;

export default async function ProfilePage() {
  const locale = await getRequestLocale();
  const { AUTH_LOGOUT_LABEL, YOUR_PROFILE_TITLE, PROFILE_MY_TOURS_SECTION, PROFILE_NO_TOURS_MESSAGE, PROFILE_PAYMENT_PENDING, PROFILE_PAYMENT_DEPOSIT_PAID, PROFILE_PAYMENT_PAID, PROFILE_PAYMENT_CANCELLED, PROFILE_TOURS_STAT_LABEL, FORM_LABELS, CURRENCY } = getTexts(locale);

  const PAYMENT_STATUS_CHIP: PaymentStatusChip = {
    pending: { label: PROFILE_PAYMENT_PENDING, color: "warning" },
    deposit_paid: { label: PROFILE_PAYMENT_DEPOSIT_PAID, color: "info" },
    paid: { label: PROFILE_PAYMENT_PAID, color: "success" },
    cancelled: { label: PROFILE_PAYMENT_CANCELLED, color: "error" },
  };

  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value ?? null;

  // The proxy guard already turned away requests with no token or an expired one; this
  // covers the same page being rendered outside a guarded request (and keeps the page
  // correct on its own, should the route ever drop out of PROTECTED_ROUTES).
  if (!jwt) {
    redirect(await localizedPath(Route.Login));
  }

  const { profileResult, isNewsletterSubscribed } = await getUserProfilePageLoader(jwt);

  // The token looked valid to the guard but Strapi refused it - the secret was rotated,
  // or the user was deleted or blocked. A Server Component cannot clear cookies, so the
  // route handler does it and sends the visitor on to the login page.
  if (profileResult.status === "unauthorized") {
    redirect(sessionExpiredPath(locale));
  }

  const userProfile = profileResult.status === "ok" ? profileResult.profile : null;
  const signups = userProfile ? await getUserEventSignupsLoader(jwt) : [];

  const displayEmail = userProfile?.email ?? "";
  const usernameFromEmail = displayEmail.split("@")[0];
  const firstName = userProfile?.firstName ?? null;
  const lastName = userProfile?.lastName ?? null;

  // Hungarian name order - the same one the sign-up details use. Until the profile is
  // filled in there is no name to show, so the local part of the email stands in.
  const displayName = [lastName, firstName].filter(Boolean).join(" ") || usernameFromEmail;
  const initials =
    [lastName, firstName]
      .map((part) => part?.charAt(0) ?? "")
      .join("")
      .toUpperCase() || usernameFromEmail.charAt(0).toUpperCase();

  return (
    <>
      <ContentListHeadline headline={YOUR_PROFILE_TITLE} isMain={true} />

      <main className="profile-page">
        <div className="profile-page__layout">
          <aside className="profile-page__sidebar">
            <div className="profile-identity">
              <span className="profile-identity__avatar" aria-hidden="true">
                {initials}
              </span>
              <p className="profile-identity__name">{displayName}</p>
              <p className="profile-identity__email">{displayEmail}</p>

              <div className="profile-identity__stat">
                <span className="profile-identity__stat-value">{signups.length}</span>
                <span className="profile-identity__stat-label">{PROFILE_TOURS_STAT_LABEL}</span>
              </div>

              <form action={logoutAction} className="profile-identity__logout">
                <SubmitButtonNoSSR text={AUTH_LOGOUT_LABEL} />
              </form>
            </div>

            <NewsletterPanel isNewsletterSubscribed={isNewsletterSubscribed} />
          </aside>

          <div className="profile-page__main">
            <ProfileForm
              email={displayEmail}
              firstName={firstName}
              lastName={lastName}
              phone={userProfile?.phone ?? null}
              country={userProfile?.country ?? null}
              city={userProfile?.city ?? null}
              zip={userProfile?.zip ?? null}
              street={userProfile?.street ?? null}
              houseNumber={userProfile?.houseNumber ?? null}
            />

            <section className="profile-panel">
              <h2 className="profile-panel__title">{PROFILE_MY_TOURS_SECTION}</h2>
              {signups.length === 0 ? (
                <p className="profile-page__empty">{PROFILE_NO_TOURS_MESSAGE}</p>
              ) : (
                <ul className="profile-tours no-list-style">
                  {signups.map((signup) =>
                    signup.event ? (
                      <li key={signup.id} className="profile-tour">
                        <div className="profile-tour__head">
                          <div className="profile-tour__main">
                            {signup.event.image?.url && (
                              <div className="profile-tour__image">
                                <StrapiImage
                                  src={signup.event.image.url}
                                  alt={signup.event.image.alternativeText || signup.event.title}
                                  width={96}
                                  height={96}
                                />
                              </div>
                            )}
                            <div className="profile-tour__headings">
                              <h3 className="profile-tour__title">
                                <CustomLink
                                  href={toPublicPath(`${Route.Tours}/${signup.event.slug}`, locale)}
                                  className="profile-tour__link"
                                  color="primary"
                                  underline="hover"
                                >
                                  {signup.event.title}
                                </CustomLink>
                              </h3>
                              <ul className="profile-tour__meta no-list-style">
                                {signup.event.startDate && (
                                  <li className="profile-tour__meta-item">
                                    <span className="profile-tour__meta-label">
                                      {FORM_LABELS.startDate}
                                    </span>
                                    <span className="profile-tour__meta-value">
                                      {formatDate(signup.event.startDate, locale)}
                                    </span>
                                  </li>
                                )}
                                {signup.event.price && (
                                  <li className="profile-tour__meta-item">
                                    <span className="profile-tour__meta-label">
                                      {FORM_LABELS.price}
                                    </span>
                                    <span className="profile-tour__meta-value">
                                      {signup.event.price} {CURRENCY}
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="profile-tour__status">
                            <CustomChip
                              label={PAYMENT_STATUS_CHIP[signup.paymentStatus].label}
                              color={PAYMENT_STATUS_CHIP[signup.paymentStatus].color}
                              size="large"
                            />
                          </div>
                        </div>
                        <SignupDetailsToggle signup={signup} />
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
