/**
 * English overrides for the backend's strings. The Hungarian file
 * (`texts-strapi.ts`) is the source of truth: a key can only exist here if it exists
 * there, and anything left out falls back to Hungarian rather than breaking.
 *
 * Merged by `get-strapi-texts.ts`; templates read the result through
 * `getStrapiTexts(locale)`.
 *
 * Deliberately not overridden:
 *   SITE_NAME / EMAIL_DEFAULT_FROM_NAME - a brand name, identical in every language.
 *   SYSTEM_EMAIL_SUBJECT_BILINGUAL      - already carries both languages by design.
 */

// E-mail header banner titles
export const SYSTEM_EMAIL_SUBJECT = {
  emailConfirmation: "Confirm your e-mail address",
  forgotPassword: "Password reset",
  eventSignup: "Tour registration confirmed",
  eventSignupAdmin: "New tour registration",
  newsletterSignup: "Newsletter subscription",
  contactRequestAdmin: "New call-back / enquiry",
  contactRequest: "Enquiry received",
};

// E-mail layout
export const EMAIL_FOOTER_RIGHTS = "All rights reserved.";
export const EMAIL_GREETING = (name: string) => `Dear ${name},`;
export const EMAIL_SIGNATURE_CLOSING = "Kind regards,";
export const EMAIL_SIGNATURE_TEAM = (organizationName: string) => `The ${organizationName} team`;
export const EMAIL_FALLBACK_LINK_LABEL = "If the button does not work, copy this link:";

// Shared field labels
export const LABEL_NAME = "Name";
export const LABEL_EMAIL = "E-mail";
export const LABEL_EMAIL_ADDRESS = "E-mail address";
export const LABEL_PHONE = "Phone number";
export const LABEL_YES = "Yes";
export const LABEL_NO = "No";

// Contact request — envelope
export const CONTACT_REQUEST_FROM_NAME = (organizationName: string) =>
  `${organizationName} Enquiries`;
export const CONTACT_REQUEST_ADMIN_MAIL_SUBJECT = "New call-back / enquiry";
export const CONTACT_REQUEST_USER_MAIL_SUBJECT = "We have received your enquiry";

// Contact request — preferred way of getting in touch
export const CONTACT_PREFERENCE_PHONE_LABEL = "By phone";
export const CONTACT_PREFERENCE_EMAIL_LABEL = "By e-mail";
export const CONTACT_PREFERENCE_PHONE_SENTENCE = "by phone, on the number you gave us";
export const CONTACT_PREFERENCE_EMAIL_SENTENCE = "by e-mail, at the address you gave us";

// Contact request — admin notification
export const CONTACT_REQUEST_ADMIN_TITLE = "A new call-back / enquiry has arrived";
export const CONTACT_REQUEST_ADMIN_INTRO = "The person below would like to get in touch with you.";
export const CONTACT_REQUEST_ADMIN_SECTION_TITLE = "Details";
export const CONTACT_REQUEST_ADMIN_PREFERENCE_LABEL = "Preferred contact";

// Contact request — confirmation to the requester
export const CONTACT_REQUEST_USER_BADGE = "Enquiry received";
export const CONTACT_REQUEST_USER_TITLE = "We have received your enquiry!";
export const CONTACT_REQUEST_USER_INTRO = (preferenceSentence: string) =>
  `Thank you for getting in touch! We will contact you shortly ${preferenceSentence}.`;
export const CONTACT_REQUEST_USER_PREFERENCE_LABEL = "How we will contact you";
export const CONTACT_REQUEST_USER_OUTRO =
  "If your contact details change in the meantime, or you have any questions, simply reply to this e-mail.";

// Contact request — API errors
export const CONTACT_REQUEST_DUPLICATE_ERROR = (windowHours: number) =>
  `An enquiry has already been received from these contact details within the last ${windowHours} hours.`;

// Event signup — envelope
export const EVENT_SIGNUP_FROM_NAME = (organizationName: string) =>
  `${organizationName} Tour registration`;
export const EVENT_SIGNUP_USER_MAIL_SUBJECT = (eventName: string) =>
  `Tour registration confirmed – ${eventName}`;
export const EVENT_SIGNUP_ADMIN_MAIL_SUBJECT = (eventName: string) =>
  `Tour registration: ${eventName}`;

// Event signup — confirmation to the applicant
export const EVENT_SIGNUP_USER_BADGE = "Registration successful";
export const EVENT_SIGNUP_USER_TITLE = "We have received your registration!";
export const EVENT_SIGNUP_USER_INTRO =
  "Thank you for registering! We are glad to confirm that your registration has been received.";
export const EVENT_SIGNUP_SELECTED_TOUR_LABEL = "Selected tour";
export const EVENT_SIGNUP_USER_GLAD = "We are glad you are joining us.";
export const EVENT_SIGNUP_USER_PAYMENT_INTRO =
  "We have received your registration. Your booking becomes final once the deposit arrives. You can find the details of your registration in your profile. The bank transfer details are below:";
export const EVENT_SIGNUP_USER_QUESTIONS = (contactEmailLink: string) =>
  `If you have any questions, feel free to write to us at ${contactEmailLink}.`;
export const EVENT_SIGNUP_USER_ATTACHMENT_NOTE = (contractName: string) =>
  `You will find the ${contractName} attached.`;
export const EVENT_SIGNUP_CONTRACT_NAME_ACCUSATIVE = "travel contract";
export const EVENT_SIGNUP_USER_SEE_YOU = "See you soon! ⛰️";

// Event signup — bank transfer details
export const CURRENCY_FALLBACK = "currency";
export const TRANSFER_SECTION_TITLE = "Bank transfer details";
export const TRANSFER_AMOUNT_LABEL = "Amount due:";
export const TRANSFER_BENEFICIARY_LABEL = "Beneficiary:";
export const TRANSFER_ACCOUNT_NUMBER_LABEL = "Account number:";
export const TRANSFER_REFERENCE_LABEL = "Reference:";

// Event signup — what happens next
export const EVENT_SIGNUP_NEXT_STEPS_TITLE = "Here is what we will go through together next:";
export const EVENT_SIGNUP_NEXT_STEPS = [
  "Once your transfer arrives we will also call you to agree how we keep in touch from there. We will add each other on Facebook, and you will join the shared Messenger group.",
  "After that we will send you a more detailed description of the tour and the kit list you will need. This is not the final briefing yet - it is there so you have a clear picture early on and can prepare at your own pace.",
  "One of the most important steps is booking your flight. Everyone arranges this themselves, but if you would like us to, we are happy to help with the booking for an additional fee.",
  "Travel insurance is mandatory and we check it before departure. If you would like, we can help you arrange that too for an additional fee.",
  "About a month before departure we send the final briefing, the exact itinerary and all the important departure information.",
];

// Event signup — admin notification
export const EVENT_SIGNUP_ADMIN_TITLE = "A new tour registration has arrived";
export const EVENT_SIGNUP_ADMIN_INTRO = "The person below registered for one of your tours.";
export const EVENT_SIGNUP_SECTION_TOUR = "Tour";
export const EVENT_SIGNUP_SECTION_APPLICANT = "Applicant details";
export const EVENT_SIGNUP_SECTION_INVOICING = "Invoicing";
export const EVENT_SIGNUP_SECTION_TRAVEL_DATA = "Travel details";
export const EVENT_SIGNUP_SECTION_NOTES = "Notes";
export const EVENT_SIGNUP_COMPANION_SECTION_TITLE = (index: number) =>
  `Companion ${index} - details`;

// Event signup — admin notification field labels
export const LABEL_TOUR_NAME = "Tour name";
export const LABEL_BILLING_COUNTRY = "Billing address (country)";
export const LABEL_BILLING_ADDRESS = "Billing address";
export const LABEL_WANTS_INVOICE = "Wants an invoice";
export const LABEL_COMPANY_NAME = "Company name";
export const LABEL_TAX_NUMBER = "Tax number";
export const LABEL_BIRTH_COUNTRY = "Country of birth";
export const LABEL_BIRTH_PLACE = "Place of birth";
export const LABEL_BIRTH_DATE = "Date of birth";
export const LABEL_DOCUMENT_TYPE = "Document type";
export const LABEL_DOCUMENT_NUMBER = "Document number";
export const LABEL_DOCUMENT_ISSUE_DATE = "Date of issue";
export const LABEL_DOCUMENT_EXPIRY_DATE = "Expiry date";
export const LABEL_ALLERGIES = "Allergies / medical info";
export const LABEL_FACEBOOK_PROFILE = "Facebook profile";
export const LABEL_NOTES = "Notes";

// Travel contract attachment
export const TRAVEL_CONTRACT_DOCUMENT_TITLE = "Travel contract";
export const TRAVEL_CONTRACT_SLUG = "travel-contract";

// Newsletter signup — envelope
export const NEWSLETTER_SIGNUP_USER_MAIL_SUBJECT = "Newsletter subscription confirmed";
export const NEWSLETTER_SIGNUP_ADMIN_MAIL_SUBJECT = "New newsletter subscription";

// Newsletter signup — confirmation to the subscriber
export const NEWSLETTER_SIGNUP_USER_TITLE = "You are subscribed!";
export const NEWSLETTER_SIGNUP_USER_INTRO = (siteName: string) =>
  `We are glad to let you know that you have successfully subscribed to the ${siteName} newsletter! We will keep you posted about our latest tours, events and news&nbsp;:)`;
export const NEWSLETTER_SIGNUP_USER_DISCLAIMER =
  "If you did not subscribe with this e-mail address, please ignore this message.";

// Newsletter signup — admin notification
export const NEWSLETTER_SIGNUP_ADMIN_TITLE = "New newsletter subscription";
export const NEWSLETTER_SIGNUP_ADMIN_INTRO =
  "The e-mail address below subscribed to the newsletter.";
export const NEWSLETTER_SIGNUP_ADMIN_SECTION_TITLE = "Subscriber details";

// Newsletter broadcast
export const NEWSLETTER_HEADER_LOGO_ALT = "Gyertek velünk newsletter";
export const NEWSLETTER_UNSUBSCRIBE_QUESTION = "No longer want to receive our newsletter?";
export const NEWSLETTER_UNSUBSCRIBE_LINK_LABEL = "Unsubscribe";

// Unsubscribe landing page
export const UNSUBSCRIBE_ERROR_TITLE = "Error";
export const UNSUBSCRIBE_INCOMPLETE_LINK = "Incomplete unsubscribe link.";
export const UNSUBSCRIBE_INVALID_LINK = "Invalid or expired link.";
export const UNSUBSCRIBE_SUCCESS_TITLE = "Unsubscribed";
export const UNSUBSCRIBE_SUCCESS_MESSAGE = "You have been unsubscribed from our newsletter.";
export const GO_HOME_LABEL = "Back to the home page";

// Email address confirmation (template generated for the Strapi admin)
export const EMAIL_CONFIRMATION_INTRO =
  "Thank you for registering on our site! Click the button below to confirm your e-mail address and start using your account&nbsp;:)";
export const EMAIL_CONFIRMATION_BUTTON_LABEL = "Confirm e-mail address";
export const EMAIL_CONFIRMATION_DISCLAIMER =
  "If you did not register on this site, please ignore this e-mail.";

// Password reset (template generated for the Strapi admin)
export const RESET_PASSWORD_INTRO =
  "You requested a new password on our site. Click the button below to choose the password you would like to use from now on&nbsp;:)";
export const RESET_PASSWORD_BUTTON_LABEL = "Reset password";
export const RESET_PASSWORD_DISCLAIMER =
  "If you did not request a password reset, please let us know as soon as possible!";
