import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const { AUTH_FORGOT_PASSWORD_TITLE } = getTexts(await getRequestLocale());
  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{AUTH_FORGOT_PASSWORD_TITLE}</h1>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
