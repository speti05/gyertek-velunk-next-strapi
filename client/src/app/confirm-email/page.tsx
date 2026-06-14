import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { AUTH_CONFIRM_EMAIL_TITLE, AUTH_BACK_TO_LOGIN, MESSAGES } from "@/utils/texts";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const isError = error === "invalid";

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{AUTH_CONFIRM_EMAIL_TITLE}</h1>
        <p className="auth-page__footer-text">
          {isError ? MESSAGES.confirmEmailFailed : MESSAGES.confirmEmailSuccess}
        </p>
        <p className="auth-page__forgot-link">
          <CustomLink href="/profile" color="secondary">{AUTH_BACK_TO_LOGIN}</CustomLink>
        </p>
      </div>
    </main>
  );
}
