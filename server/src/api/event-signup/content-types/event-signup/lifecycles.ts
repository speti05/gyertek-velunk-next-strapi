export default {
  async beforeCreate(event: { params: { data: any } }) {
    const ctx = strapi.requestContext.get() as any;
    const userId = ctx?.state?.user?.id;
    if (userId) {
      event.params.data.user = userId;
    }
  },
};
