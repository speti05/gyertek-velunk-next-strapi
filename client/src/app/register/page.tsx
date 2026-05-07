import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? null;

  if (jwt) {
    redirect("/profile");
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <RegisterForm />
      </div>
    </main>
  );
}
