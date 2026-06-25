export interface SiteSettings {
  organizationName: string;
  contactEmail: string;
  bankAccountNumber: string;
  bankBeneficiaryName: string;
  defaultCurrency: string;
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const settings = await strapi.db.query("api::site-setting.site-setting").findOne({});
  if (!settings) throw new Error("Site settings not configured in Strapi admin.");
  return {
    organizationName: settings.organizationName,
    contactEmail: settings.contactEmail,
    bankAccountNumber: settings.bankAccountNumber,
    bankBeneficiaryName: settings.bankBeneficiaryName,
    defaultCurrency: settings.defaultCurrency,
  };
};
