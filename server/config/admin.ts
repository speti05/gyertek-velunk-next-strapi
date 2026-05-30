const getPreviewPathname = (uid: string, { document }: { locale?: string; document: Record<string, unknown> }): string | null => {
  const { slug } = document as { slug?: string };

  switch (uid) {
    case 'api::article.article':
      return slug ? `/beszamolok/${slug}` : null;
    case 'api::event.event':
      return slug ? `/turaink/${slug}` : null;
    case 'api::page.page':
      return slug ? `/${slug}` : null;
    case 'api::home-page.home-page':
      return '/';
    default:
      return null;
  }
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      async handler(uid: string, { documentId, locale, status }: { documentId: string; locale?: string; status: string }) {
        const document = await strapi.documents(uid as Parameters<typeof strapi.documents>[0]).findOne({ documentId });
        const pathname = getPreviewPathname(uid, { locale, document });

        if (!pathname) return null;

        const urlSearchParams = new URLSearchParams({
          url: pathname,
          secret: env('PREVIEW_SECRET'),
          status,
        });

        return `${env('CLIENT_URL')}/api/preview?${urlSearchParams}`;
      },
    },
  },
});
