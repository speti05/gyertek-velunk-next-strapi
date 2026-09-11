import qs from "qs";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";
import { getUserProfileService } from "./auth-service";
import { getPreviewContext, previewFetchOptions, type PreviewContext } from "@/utils/preview-mode";
import { getViewerContext, viewerFetchOptions, type ViewerContext } from "@/data/viewer";

const BASE_URL = getStrapiURL();
const DEFAULT_BLOG_PAGE_SIZE = 3;

// Entries flagged as disabled in Strapi are hidden from the public site.
// Older entries created before the flag existed have no value, so treat null as enabled.
// Strapi enforces this too (see the hide-disabled-content middleware); the filter is
// dropped here only for viewers that are allowed to see disabled entries anyway.
const notDisabledFilter = {
  $or: [{ disabled: { $null: true } }, { disabled: { $eq: false } }],
};

/**
 * A test user's request is authenticated, so Strapi applies the Authenticated role's
 * permissions instead of Public's. If that role is missing read access to the content
 * type, the request is rejected and the visitor would see an empty page. Fall back to a
 * public read in that case - the API still hides disabled entries, so nothing leaks.
 */
async function fetchContent(url: string, preview: PreviewContext, viewer: ViewerContext) {
  const publicOptions = { method: "GET" as const, ...previewFetchOptions(preview) };
  const result = await fetchAPI(url, { ...publicOptions, ...viewerFetchOptions(viewer) });

  const status = (result as { status?: number } | null)?.status;
  if (viewer.isTestUser && (status === 401 || status === 403)) {
    console.warn(
      `[loaders] Strapi rejected the test user's token on ${new URL(url).pathname} (${status}). ` +
        "Grant the Authenticated role find/findOne on this content type, otherwise disabled " +
        "entries stay hidden. Falling back to a public read."
    );
    return fetchAPI(url, publicOptions);
  }

  return result;
}

const canSeeDisabled = (preview: { isDraft: boolean }, viewer: { isTestUser: boolean }) =>
  preview.isDraft || viewer.isTestUser;

const disabledFilters = (preview: { isDraft: boolean }, viewer: { isTestUser: boolean }) =>
  canSeeDisabled(preview, viewer) ? [] : [notDisabledFilter];
const homePageQuery = {
  populate: {
    blocks: {
      on: {
        "blocks.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            logo: {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
              },
            },
            cta: true,
          },
        },
        "blocks.info-block": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            cta: true,
          },
        },

        "blocks.featured-article": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: true,
          },
        },
        "blocks.subscribe": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
        "blocks.searchable-card-list": {
          populate: true,
        },
        "blocks.hero-with-text": {
          populate: {
            images: {
              fields: ["url", "alternativeText"],
            },
            link: true,
          },
        },
        "blocks.event-signup-form": {
          populate: true,
        },
        "blocks.text-content-block": {
          populate: true,
        },
        "blocks.contact-request-form": {
          populate: true,
        },
      },
    },
  },
};

export async function getHomePage() {
  const preview = await getPreviewContext();
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({ ...homePageQuery, status: preview.status });

  return await fetchAPI(url.href, { method: "GET", ...previewFetchOptions(preview) });
}

const pageBySlugQuery = (slug: string, status?: "draft") =>
  qs.stringify({
    status,
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          "blocks.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              logo: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
              cta: true,
            },
          },
          "blocks.info-block": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },

          "blocks.featured-article": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              link: true,
            },
          },
          "blocks.subscribe": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          "blocks.searchable-card-list": {
            populate: true,
          },
          "blocks.hero-with-calendar": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          "blocks.event-signup-form": {
            populate: true,
          },
          "blocks.text-content-block": {
            populate: true,
          },
          "blocks.contact-request-form": {
            populate: true,
          },
          "blocks.socials": {
            populate: true,
          },
        },
      },
    },
  });

export async function getPageBySlug(slug: string) {
  const preview = await getPreviewContext();
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug, preview.status);
  return await fetchAPI(url.href, { method: "GET", ...previewFetchOptions(preview) });
}

const globalSettingQuery = {
  populate: {
    header: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
        navigation: true,
        cta: true,
      },
    },
    footer: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
        navigation: true,
        policies: true,
      },
    },
  },
};

export async function getGlobalSettings() {
  const preview = await getPreviewContext();
  const path = "/api/global";
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({ ...globalSettingQuery, status: preview.status });
  return fetchAPI(url.href, { method: "GET", ...previewFetchOptions(preview) });
}

export async function getContent(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  pageSize: number = DEFAULT_BLOG_PAGE_SIZE
) {
  const [preview, viewer] = await Promise.all([getPreviewContext(), getViewerContext()]);
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
    status: preview.status,
    sort: ["createdAt:desc"],
    filters: {
      $and: [
        { $or: [{ title: { $containsi: query } }, { description: { $containsi: query } }] },
        ...disabledFilters(preview, viewer),
        ...(featured ? [{ featured: { $eq: featured } }] : []),
      ],
    },
    pagination: {
      pageSize: pageSize,
      page: parseInt(page || "1"),
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchContent(url.href, preview, viewer);
}

const blogPopulate = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          cta: true,
        },
      },
      "blocks.info-block": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.featured-article": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          link: true,
        },
      },
      "blocks.subscribe": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.heading": {
        populate: true,
      },
      "blocks.paragraph-with-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.paragraph": {
        populate: true,
      },
      "blocks.full-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.hero-with-calendar": {
        populate: true,
      },
      "blocks.hero-with-text": {
        populate: true,
      },
      "blocks.youtube-video": {
        populate: true,
      },
      "blocks.picture-gallery": {
        populate: {
          images: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  },
};

export async function getContentBySlug(slug: string, path: string) {
  const [preview, viewer] = await Promise.all([getPreviewContext(), getViewerContext()]);
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({
    status: preview.status,
    filters: {
      $and: [{ slug: { $eq: slug } }, ...disabledFilters(preview, viewer)],
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      ...blogPopulate,
    },
  });

  return fetchContent(url.href, preview, viewer);
}

export interface CompanionData {
  lastName: string;
  firstName: string;
  phone: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
}

export type PaymentStatus = "pending" | "deposit_paid" | "paid" | "cancelled";

export interface EventSignupEntry {
  id: number;
  documentId: string;
  paymentStatus: PaymentStatus;
  firstName: string | null;
  lastName: string | null;
  telephone: string | null;
  billingCountry: string | null;
  billingCity: string | null;
  billingZip: string | null;
  billingStreet: string | null;
  billingHouseNumber: string | null;
  wantInvoice: boolean;
  companyName: string | null;
  taxNumber: string | null;
  birthCountry: string | null;
  birthPlace: string | null;
  birthDate: string | null;
  documentType: string | null;
  documentNumber: string | null;
  documentIssueDate: string | null;
  documentExpiryDate: string | null;
  allergies: string | null;
  fbLink: string | null;
  companions: CompanionData[] | null;
  notes: string | null;
  event: {
    documentId: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    price: string | null;
    slug: string;
    image: { url: string; alternativeText: string | null } | null;
  } | null;
}

export async function getMyNewsletterSubscriptionLoader(jwt: string): Promise<boolean> {
  const url = new URL("/api/newsletter-signups/me", BASE_URL);
  const result = await fetchAPI(url.href, {
    method: "GET",
    authToken: jwt,
    next: { revalidate: 0 },
  });
  return result?.subscribed ?? false;
}

export async function getUserProfilePageLoader(jwt: string) {
  const [profile, isNewsletterSubscribed] = await Promise.all([
    getUserProfileService(jwt),
    getMyNewsletterSubscriptionLoader(jwt),
  ]);
  return { profile, isNewsletterSubscribed };
}

export async function getUserEventSignupsLoader(jwt: string): Promise<EventSignupEntry[]> {
  const url = new URL("/api/event-signups", BASE_URL);

  url.search = qs.stringify({
    populate: {
      event: {
        populate: {
          image: { fields: ["url", "alternativeText"] },
        },
      },
    },
    fields: [
      "paymentStatus",
      "firstName",
      "lastName",
      "telephone",
      "billingCountry",
      "billingCity",
      "billingZip",
      "billingStreet",
      "billingHouseNumber",
      "wantInvoice",
      "companyName",
      "taxNumber",
      "birthCountry",
      "birthPlace",
      "birthDate",
      "documentType",
      "documentNumber",
      "documentIssueDate",
      "documentExpiryDate",
      "allergies",
      "fbLink",
      "companions",
      "notes",
    ],
  });

  const result = await fetchAPI(url.href, {
    method: "GET",
    authToken: jwt,
    next: { revalidate: 0 },
  });

  return result?.data ?? [];
}

export async function getContentForCalendar(path: string, year: number) {
  const [preview, viewer] = await Promise.all([getPreviewContext(), getViewerContext()]);
  const url = new URL(path, BASE_URL);
  const startOfYear = new Date(year, 0, 1).toISOString();
  const endOfYear = new Date(year, 11, 31).toISOString();

  url.search = qs.stringify({
    status: preview.status,
    sort: ["startDate:asc"],
    filters: {
      $and: [
        {
          startDate: {
            $gte: startOfYear,
          },
        },
        {
          startDate: {
            $lte: endOfYear,
          },
        },
        ...disabledFilters(preview, viewer),
      ],
    },
    pagination: {
      pageSize: 100,
      page: 1,
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchContent(url.href, preview, viewer);
}
