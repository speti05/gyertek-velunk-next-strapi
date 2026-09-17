import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localizedPath } from "@/data/locale";
import { RegisterForm } from "./RegisterForm";
import { Route } from "@/i18n/config";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? null;

  if (jwt) {
    redirect(await localizedPath(Route.Profile));
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <RegisterForm />
      </div>
    </main>
  );
}
