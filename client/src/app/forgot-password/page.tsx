import { AUTH_FORGOT_PASSWORD_TITLE } from "@/utils/texts";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{AUTH_FORGOT_PASSWORD_TITLE}</h1>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
