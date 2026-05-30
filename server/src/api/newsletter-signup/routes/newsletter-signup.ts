/**
 * newsletter-signup router
 */

export default {
  routes: [
    // Custom routes first — must be before /:id to avoid param capture
    {
      method: 'GET',
      path: '/newsletter-signups/unsubscribe',
      handler: 'newsletter-signup.unsubscribe',
      config: { auth: false, middlewares: [] },
    },
    {
      method: 'GET',
      path: '/newsletter-signups/me',
      handler: 'newsletter-signup.findMySubscription',
      config: { auth: false, middlewares: [] },
    },
    {
      method: 'POST',
      path: '/newsletter-signups/me',
      handler: 'newsletter-signup.subscribeMe',
      config: { auth: false, middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/newsletter-signups/me',
      handler: 'newsletter-signup.unsubscribeMe',
      config: { auth: false, middlewares: [] },
    },
    // Core routes
    { method: 'GET',    path: '/newsletter-signups',     handler: 'newsletter-signup.find',     config: { middlewares: [] } },
    { method: 'POST',   path: '/newsletter-signups',     handler: 'newsletter-signup.create',   config: { middlewares: [] } },
    { method: 'GET',    path: '/newsletter-signups/:id', handler: 'newsletter-signup.findOne',  config: { middlewares: [] } },
    { method: 'PUT',    path: '/newsletter-signups/:id', handler: 'newsletter-signup.update',   config: { middlewares: [] } },
    { method: 'DELETE', path: '/newsletter-signups/:id', handler: 'newsletter-signup.delete',   config: { middlewares: [] } },
  ],
};
