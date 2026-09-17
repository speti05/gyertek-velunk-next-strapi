import { getTexts } from "@/i18n/texts";
import { getRequestLocale, localizedPath } from "@/data/locale";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { Route } from "@/i18n/config";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { AUTH_CONFIRM_EMAIL_TITLE, AUTH_BACK_TO_LOGIN, MESSAGES } = getTexts(await getRequestLocale());
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
          <CustomLink href={await localizedPath(Route.Profile)} color="secondary">
            {AUTH_BACK_TO_LOGIN}
          </CustomLink>
        </p>
      </div>
    </main>
  );
}
