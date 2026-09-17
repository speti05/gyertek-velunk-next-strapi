import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { AUTH_INVALID_RESET_LINK, AUTH_RESET_PASSWORD_TITLE } = getTexts(await getRequestLocale());
  const { code } = await searchParams;

  if (!code) {
    return (
      <main className="auth-page">
        <div className="auth-page__card">
          <p className="auth-page__greeting">{AUTH_INVALID_RESET_LINK}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{AUTH_RESET_PASSWORD_TITLE}</h1>
        <ResetPasswordForm code={code} />
      </div>
    </main>
  );
}
