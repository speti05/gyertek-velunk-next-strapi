/**
 * Members of this role may read entries flagged as `disabled`.
 *
 * Strapi slugifies role names into `type`, which is what the API exposes on the
 * authenticated user - the checks are done against the type, not the display name.
 */
export const TEST_USER_ROLE_TYPE = "test-user";
export const TEST_USER_ROLE_NAME = "TestUser";
export const TEST_USER_ROLE_DESCRIPTION =
  "Authenticated user who can also see entries flagged as disabled.";

/**
 * The role replaces Authenticated for its members - a Strapi user has exactly one role -
 * so it needs everything Authenticated grants, plus read access to the content types
 * that carry the `disabled` flag.
 */
export const TEST_USER_ROLE_PERMISSIONS = [
  "plugin::users-permissions.user.me",
  "plugin::users-permissions.user.update",
  "plugin::users-permissions.auth.changePassword",
  "api::event-signup.event-signup.create",
  "api::event-signup.event-signup.find",
  "api::article.article.find",
  "api::article.article.findOne",
  "api::blog.blog.find",
  "api::blog.blog.findOne",
  "api::event.event.find",
  "api::event.event.findOne",
];
