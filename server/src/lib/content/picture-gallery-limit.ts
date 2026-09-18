import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { getStrapiTexts } from "../../i18n/get-strapi-texts";

const PICTURE_GALLERY_COMPONENT = "blocks.picture-gallery";

/**
 * How many images a single Picture Gallery block may hold.
 *
 * Strapi has no schema-level size limit for multiple media fields (the Content-Type
 * Builder only exposes allowed types, required and private), so the cap lives here and
 * is enforced by the document service middleware below.
 */
export const MAX_PICTURE_GALLERY_IMAGES = 25;

/** The shapes a media field can arrive in: a plain array, or a relation operation object. */
function countImages(images: unknown): number {
  if (Array.isArray(images)) return images.length;

  if (images && typeof images === "object") {
    const { set, connect } = images as { set?: unknown; connect?: unknown };
    if (Array.isArray(set)) return set.length;
    if (Array.isArray(connect)) return connect.length;
  }

  return 0;
}

/**
 * Walks whatever is being written - dynamic zones, nested components, repeatables - and
 * throws on the first Picture Gallery block that carries too many images.
 */
function assertGalleriesWithinLimit(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertGalleriesWithinLimit);
    return;
  }

  if (!value || typeof value !== "object") return;

  const node = value as Record<string, unknown>;

  if (node.__component === PICTURE_GALLERY_COMPONENT) {
    const count = countImages(node.images);
    if (count > MAX_PICTURE_GALLERY_IMAGES) {
      const texts = getStrapiTexts();
      throw new errors.ValidationError(
        texts.PICTURE_GALLERY_TOO_MANY_IMAGES_ERROR(MAX_PICTURE_GALLERY_IMAGES, count)
      );
    }
  }

  Object.values(node).forEach(assertGalleriesWithinLimit);
}

/**
 * Registers the limit on every write that goes through the document service - the admin
 * panel's content manager and the REST API alike.
 */
export function applyPictureGalleryLimit(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.action === "create" || context.action === "update") {
      assertGalleriesWithinLimit((context.params as { data?: unknown })?.data);
    }
    return next();
  });
}
