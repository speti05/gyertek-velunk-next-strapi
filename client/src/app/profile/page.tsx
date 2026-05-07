import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/data/auth-actions";
import { SubmitButton } from "@/components/SubmitButton";
import { getUserProfileService } from "@/data/auth-service";
import { getUserEventSignupsLoader } from "@/data/loaders";
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

  const userProfile = await getUserProfileService(jwt);
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
        />

        <section className="auth-page__section">
          <h2 className="auth-page__section-title">{PROFILE_MY_TOURS_SECTION}</h2>
          {signups.length === 0 ? (
            <p className="auth-page__footer-text">{PROFILE_NO_TOURS_MESSAGE}</p>
          ) : (
            <ul className="auth-page__tours-list">
              {signups.map((signup) => (
                <li key={signup.id} className="auth-page__tour-item">
                  {signup.event ? (
                    <>
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
                    </>
                  ) : (
                    <span className="auth-page__tour-title">—</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <form action={logoutAction} className="auth-page__logout">
          <SubmitButton text={AUTH_LOGOUT_LABEL} />
        </form>
      </div>
    </main>
  );
}
