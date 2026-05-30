import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/data/auth-actions";
import { SubmitButtonNoSSR } from "@/components/SubmitButtonNoSSR";
import { getUserEventSignupsLoader, getUserProfilePageLoader } from "@/data/loaders";
import { ProfileForm } from "./ProfileForm";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import {
  AUTH_LOGOUT_LABEL,
  AUTH_HELLO,
  PROFILE_MY_TOURS_SECTION,
  PROFILE_NO_TOURS_MESSAGE,
  FORM_LABELS,
} from "@/utils/texts";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? null;

  if (!jwt) {
    redirect("/login");
  }

  const { profile: userProfile, isNewsletterSubscribed } = await getUserProfilePageLoader(jwt);
  const signups = userProfile ? await getUserEventSignupsLoader(jwt) : [];

  const displayEmail = userProfile?.email ?? "";
  const displayName = displayEmail.split("@")[0];

  return (
    <main className="auth-page auth-page--profile">
      <div className="auth-page__card auth-page__card--wide">
        <h1 className="auth-page__title">{AUTH_HELLO(displayName)}</h1>

        <ProfileForm
          email={displayEmail}
          firstName={userProfile?.firstName ?? null}
          lastName={userProfile?.lastName ?? null}
          phone={userProfile?.phone ?? null}
          isNewsletterSubscribed={isNewsletterSubscribed}
        />

        <section className="auth-page__section">
          <h2 className="auth-page__section-title">{PROFILE_MY_TOURS_SECTION}</h2>
          {signups.length === 0 ? (
            <p className="auth-page__footer-text">{PROFILE_NO_TOURS_MESSAGE}</p>
          ) : (
            <ul className="auth-page__tours-list no-list-style">
              {signups.map((signup) =>
                signup.event ? (
                  <li key={signup.id} className="auth-page__tour-item">
                    <Link href={`/turaink/${signup.event.slug}`} className="auth-page__tour-title">
                      {signup.event.title}
                    </Link>
                    {signup.event.startDate && (
                      <span className="auth-page__tour-meta">
                        {FORM_LABELS.startDate}: {formatDate(signup.event.startDate)}
                      </span>
                    )}
                    {signup.event.price && (
                      <span className="auth-page__tour-meta">
                        {FORM_LABELS.price}: {signup.event.price}
                      </span>
                    )}
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>

        <form action={logoutAction} className="auth-page__logout">
          <SubmitButtonNoSSR text={AUTH_LOGOUT_LABEL} />
        </form>
      </div>
    </main>
  );
}
