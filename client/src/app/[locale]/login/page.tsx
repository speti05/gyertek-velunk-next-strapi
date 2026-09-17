import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRequestLocale, localizedPath } from "@/data/locale";
import { AuthForm } from "@/app/[locale]/profile/AuthForm";
import { Route } from "@/i18n/config";
import { AUTH_COOKIE, SESSION_EXPIRED_VALUE } from "@/data/auth-guard";
import { getTexts } from "@/i18n/texts";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value ?? null;

  if (jwt) {
    redirect(await localizedPath(Route.Profile));
  }

  // Set by the route guard when it turned the visitor away from a protected page.
  const { session } = await searchParams;
  const { MESSAGES } = getTexts(await getRequestLocale());
  const notice = session === SESSION_EXPIRED_VALUE ? MESSAGES.sessionExpired : undefined;

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <AuthForm notice={notice} />
      </div>
    </main>
  );
}
