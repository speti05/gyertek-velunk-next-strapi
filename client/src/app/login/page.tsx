import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/app/profile/AuthForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? null;

  if (jwt) {
    redirect("/profile");
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <AuthForm />
      </div>
    </main>
  );
}
