export default {
  beforeCreate(event: { params: { data: { user?: number } } }) {
    const ctx = strapi.requestContext.get();
    const userId = ctx?.state?.user?.id;
    if (userId) {
      event.params.data.user = userId;
    }
  },
};
