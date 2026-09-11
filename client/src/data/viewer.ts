import { cookies } from "next/headers";
import { cache } from "react";
import { getUserProfileService } from "@/data/auth-service";

/** Mirrors TEST_USER_ROLE_TYPE in the Strapi app. */
const TEST_USER_ROLE_TYPE = "test-user";

export type ViewerContext = {
  jwt: string | null;
  /** Members of the TestUser role are allowed to see entries flagged as disabled. */
  isTestUser: boolean;
};

const ANONYMOUS: ViewerContext = { jwt: null, isTestUser: false };

/**
 * Who is browsing, from the point of view of content visibility. Cached per request so
 * a page with several content loaders only resolves the profile once.
 *
 * cookies() throws outside a request scope (e.g. during static generation); there is no
 * signed-in viewer in that case.
 */
export const getViewerContext = cache(async (): Promise<ViewerContext> => {
  let jwt: string | null = null;
  try {
    jwt = (await cookies()).get("jwt")?.value ?? null;
  } catch {
    return ANONYMOUS;
  }

  if (!jwt) return ANONYMOUS;

  const profile = await getUserProfileService(jwt);
  return { jwt, isTestUser: profile?.role?.type === TEST_USER_ROLE_TYPE };
});

/**
 * Content fetch options for the current viewer. The JWT is only forwarded for test
 * users: the Authenticated role does not necessarily hold the same read permissions as
 * Public, so an ordinary signed-in visitor keeps reading as Public.
 */
export function viewerFetchOptions(viewer: ViewerContext) {
  if (!viewer.isTestUser || !viewer.jwt) return {};
  return { authToken: viewer.jwt, cache: "no-store" as const };
}
