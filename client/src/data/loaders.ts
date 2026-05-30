import qs from "qs";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";
import { getUserProfileService } from "./auth-service";

const BASE_URL = getStrapiURL();
const DEFAULT_BLOG_PAGE_SIZE = 3;
const homePageQuery = qs.stringify({
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
              image: {
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
          }
        },
      },
    },
});

export async function getHomePage() {
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);
  url.search = homePageQuery;

  return await fetchAPI(url.href, { method: "GET" });
}

const pageBySlugQuery = (slug: string) =>
  qs.stringify({
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
          }
        },
      },
    },
  });

export async function getPageBySlug(slug: string) {
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug);
  return await fetchAPI(url.href, { method: "GET" });
}

const globalSettingQuery = qs.stringify({
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
});

export async function getGlobalSettings() {
  const path = "/api/global";
  const url = new URL(path, BASE_URL);
  url.search = globalSettingQuery;
  return fetchAPI(url.href, { method: "GET" });
}

export async function getContent(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  pageSize: number = DEFAULT_BLOG_PAGE_SIZE,
) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
      ],
      ...(featured && { featured: { $eq: featured } }),
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

  return fetchAPI(url.href, { method: "GET" });
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
    },
  },
};

export async function getContentBySlug(slug: string, path: string) {
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      ...blogPopulate,
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}

export interface EventSignupEntry {
  id: number;
  documentId: string;
  event: {
    documentId: string;
    title: string;
    startDate: string | null;
    price: string | null;
    slug: string;
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

export async function getUserEventSignupsLoader(
  jwt: string
): Promise<EventSignupEntry[]> {
  const url = new URL("/api/event-signups", BASE_URL);

  const result = await fetchAPI(url.href, {
    method: "GET",
    authToken: jwt,
    next: { revalidate: 0 },
  });

  return result?.data ?? [];
}

export async function getContentForCalendar(
  path: string,
  year: number,
) {
  const url = new URL(path, BASE_URL);
  const startOfYear = new Date(year, 0, 1).toISOString();
  const endOfYear = new Date(year, 11, 31).toISOString();

  url.search = qs.stringify({
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
      ],
    },
    pagination: {
      pageSize: 100,
      page: 1
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}