"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

/**
 * The profile page only renders for a logged-in visitor, but the header's auth state
 * comes from the root layout, which a soft navigation does not re-render. If the login
 * cookie was set outside this tab's router (e.g. logging in from another tab after
 * confirming the email), the header still shows the login button - refresh once so the
 * layout is rendered again with the current cookies.
 */
export function AuthStateSync() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.refresh();
  }, [isLoggedIn, router]);

  return null;
}
