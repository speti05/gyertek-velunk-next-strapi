import {
  MAX_COMPANY_NAME,
  TAX_NUMBER_DIGITS,
  MIN_PLACE_NAME,
  MIN_DOCUMENT_NUMBER,
} from "@/components/custom-ui-components/custom-text-input/input-length-limits";

/**
 * English overrides for `texts-client.ts`.
 *
 * Hungarian is the source of truth: this file only lists the keys that have an English
 * translation, and `i18n/texts.ts` merges it over the Hungarian dictionary. A key that is
 * missing here falls back to Hungarian rather than rendering an empty string, so the site
 * stays usable while the translation is filled in.
 *
 * The three grouped exports (FORM_LABELS, MESSAGES, SIGNUP_VALIDATION) are merged one
 * level deep, so a partial object is fine here too.
 *
 * Keys intentionally NOT overridden, because they are identical in both languages:
 * SITE_TITLE, LOGO_ALT_FALLBACK, LANGUAGE_NAMES, LANGUAGE_SHORT_NAMES, DIALOG_CONFIRM_LABEL.
 */

// Events
export const FEATURED_EVENTS_LABEL = "Featured tours";
export const FEATURED_EVENTS_SEARCH_LABEL = "Search featured tours";
export const EVENTS_LABEL = "Our tours";
export const EVENTS_SEARCH_LABEL = "Search tours";

// Articles
export const FEATURED_ARTICLES_LABEL = "Featured reports";
export const FEATURED_ARTICLES_SEARCH_LABEL = "Search featured reports";
export const ARTICLES_LABEL = "Our reports";
export const ARTICLES_SEARCH_LABEL = "Search reports";

// Blog
export const BLOG_LABEL = "Our blog";
export const BLOG_SEARCH_LABEL = "Search blog posts";

// Content list
export const CONTENT_LIST_EMPTY_TITLE = "No results.";
export const CONTENT_LIST_EMPTY_DESCRIPTION =
  "There are no entries of this type matching your search yet.";

// Pagination
export const PAGINATION_PAGE_LABEL = "Page";
export const PAGINATION_NAV_ARIA = "Pagination";

// Empty reason overlay (SearchableCardList)
export const EMPTY_REASON_DEFAULT_TITLE = "This list has no entries yet";
export const EMPTY_REASON_DEFAULT_TEXT = "Coming soon ...";
export const EMPTY_REASON_CLOSE_LABEL = "Close";

// Picture gallery
export const PICTURE_GALLERY_EMPTY_TITLE = "No pictures.";
export const PICTURE_GALLERY_EMPTY_DESCRIPTION = "This gallery has no displayable pictures yet.";

// Hero with text
export const HERO_WITH_TEXT_EMPTY_TITLE = "No pictures.";
export const HERO_WITH_TEXT_EMPTY_DESCRIPTION = "This section has no displayable pictures yet.";

export const TOUR_CALENDAR_LABEL = "Tour calendar";
export const TOUR_SIGNUP_HEADLINE = "Tour sign-up";

export const YOUTUBE_VIDEO_FALLBACK_TITLE = "YouTube video";

// Metadata
export const SITE_DESCRIPTION = "Hiking tours in Hungary and abroad.";

// Language switcher
export const LANGUAGE_SWITCHER_LABEL = "Language";

// Header
export const HEADER_NAV_LABEL = "Main navigation";
export const HEADER_ACCOUNT_MENU_LABEL = "Account";
export const HEADER_MENU_TOGGLE_LABEL = "Menu";
export const SCROLL_TO_TOP_LABEL = "Scroll back to the top of the page";

// General
export const SEARCH_PLACEHOLDER = "Search";
export const DIALOG_CANCEL_LABEL = "Cancel";
export const DIALOG_PROCEED_LABEL = "Confirm";
export const LOADING_LABEL = "Loading...";
export const GO_HOME_LABEL = "Back to the home page";
export const SERVER_SIDE_ERROR_LABEL = "Server-side error";
export const PAGE_NOT_FOUND_LABEL = "Page not found";
export const ERROR_LABEL = "Something went wrong, we are sorry. Please try again later.";
export const NOT_FOUND_LABEL = "Sorry, this page has wandered off, or the link is simply broken.";
export const TRY_AGAIN_LABEL = "Try again";
export const MANDATORY_CHECKBOX_TOOLTIP = "Must be ticked";

export const CARD_PERSON = "person";
export const CURRENCY = "HUF";
export const DIFFICULTY_LABEL = "Difficulty";

export const FORM_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  telephone: "Phone",
  phone: "Phone number",
  submit: "Register",
  startDate: "Start date",
  endDate: "End date",
  registrationDeadline: "Registration deadline",
  price: "Price (per person)",
  country: "Country",
  city: "City",
  zip: "Postcode",
  street: "Street",
  houseNumber: "House number",
};

export const MESSAGES = {
  emailInvalid: "Enter a valid email address",
  invalidFirstName: "Enter your first name",
  invalidLastName: "Enter your last name",
  invalidTelephone: "Enter a valid phone number. ",
  enterPhoneNumber: "Enter your phone number. ",
  invalidCountry: "Choose a country",
  invalidCity: "Enter the city",
  invalidZip: "Enter the postcode",
  invalidStreet: "Enter the street",
  invalidHouseNumber: "Enter the house number",
  someThingWentWrong: "Something went wrong. Please try again later.",
  failedToSubscribe: "Subscription failed.",
  succesfullySubscribed: "You have subscribed to our newsletter.",
  emailAlreadySubscribed: "This email address is already subscribed to the newsletter.",
  failedToSubscribeToEvent: "Sign-up failed.",
  succesfullySubscribedToEvent: "Sign-up successful.",
  recaptchaFailed: "The security check failed. Please try again.",
  invalidPassword: "The password must be between 6 and 15 characters long",
  loginFailed: "Incorrect email address or password.",
  sessionExpired: "Your session has expired. Please sign in again.",
  emailAlreadyTaken: "This email address is already registered.",
  registrationFailed: "Registration failed. Please try again.",
  invalidOperation: "Invalid operation.",
  tryAgain: "Something went wrong. Please try again.",
  passwordMismatch: "The two passwords do not match.",
  passwordNeedsUppercase: "The password must contain at least one uppercase letter.",
  passwordNeedsLowercase: "The password must contain at least one lowercase letter.",
  passwordNeedsSpecial: "The password must contain at least one special character.",
  registrationEmailSent:
    "Registration successful! Please confirm your email address by clicking the link in the email we sent you.",
  emailNotConfirmed:
    "This email address is already registered but not yet confirmed. Please confirm your email address by clicking the link in the email we sent you.",
  confirmationEmailResent:
    "We have sent you a new confirmation email. Please check your inbox (and your spam folder too).",
  confirmationEmailResendFailed:
    "We could not send the confirmation email. Please try again later.",
  confirmEmailSuccess: "Your email address has been confirmed. You can log in now.",
  confirmEmailFailed: "Email confirmation failed. The link is invalid or has expired.",
  confirmEmailInvalidLink: "Invalid confirmation link.",
  profileSaveSuccess: "Your details have been saved.",
  profileSaveFailed: "Saving failed. Please try again.",
  missingProfileData: "Please fill in your basic details in your profile before signing up.",
  loginRequired: "Please log in to sign up.",
  newsletterSubscribeSuccess: "You have subscribed to the newsletter.",
  newsletterUnsubscribeSuccess: "You have unsubscribed from the newsletter.",
  newsletterToggleFailed: "Something went wrong. Please try again.",
  contactRequestSuccess: "Thank you! We will get in touch with you soon.",
  contactRequestFailed: "We could not send your request. Please try again later.",
  contactRequestAlreadyExists:
    "We have already received a request from you with these contact details. We will get in touch with you soon!",
  invalidName: "Enter your name.",
  invalidPhone: "Enter your phone number.",
  invalidContactEmail: "Enter your email address.",
};

// Auth
export const AUTH_LOGIN_LABEL = "Log in";
export const AUTH_REGISTER_LABEL = "Register";
export const AUTH_LOGOUT_LABEL = "Log out";
export const AUTH_PASSWORD_LABEL = "Password";
export const AUTH_DIVIDER_LABEL = "or";
export const AUTH_NO_ACCOUNT_HINT = "No account yet?";
export const AUTH_WELCOME_MESSAGE = "Glad to have you here.";
export const AUTH_PROFILE_NAV_LABEL = "Your profile";
export const YOUR_PROFILE_TITLE = "Your profile";
export const AUTH_FORGOT_PASSWORD_LABEL = "Forgot your password?";
export const AUTH_FORGOT_PASSWORD_TITLE = "Forgotten password";
export const AUTH_FORGOT_PASSWORD_SUCCESS =
  "If this email address is registered, you will receive a link shortly. The link is valid for 1 hour.";
export const AUTH_RESET_PASSWORD_TITLE = "Set a new password";
export const AUTH_NEW_PASSWORD_LABEL = "New password";
export const AUTH_CONFIRM_PASSWORD_LABEL = "Confirm password";
export const AUTH_BACK_TO_LOGIN = "← Back to login";
export const AUTH_HAS_ACCOUNT_HINT = "Already have an account?";
export const AUTH_CONFIRM_EMAIL_TITLE = "Email confirmation";
export const AUTH_RESEND_CONFIRMATION_LINK = "click here to get a new confirmation email";
export const AUTH_RESEND_CONFIRMATION_PREFIX = " If you did not receive the email, ";

export const PASSWORD_RULES = [
  {
    label: "Between 6 and 15 characters",
    test: (p: string) => p.length >= 6 && p.length <= 15,
  },
  {
    label: "Lowercase and uppercase letter",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { label: "Special character (e.g. !@#$%)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];
export const AUTH_INVALID_RESET_LINK = "Invalid or expired link.";
export const AUTH_SAVE_LABEL = "Save";
export const AUTH_SHOW_PASSWORD_LABEL = "Show password";
export const AUTH_HIDE_PASSWORD_LABEL = "Hide password";
export const AUTH_TERMS_ACCEPT_PREFIX = "I have read and accept the ";
export const AUTH_TERMS_LINK_LABEL = "Terms and Conditions";
export const AUTH_TERMS_ACCEPT_INFIX = " and the ";
export const AUTH_PRIVACY_LINK_LABEL = "Privacy Policy";
export const AUTH_TERMS_ACCEPT_SUFFIX = ".";
export const AUTH_TERMS_REQUIRED_ERROR =
  "Accepting the Terms and Conditions and the Privacy Policy is required to register.";

// Profile
export const PROFILE_TITLE = "My profile";
export const PROFILE_BASIC_DATA_SECTION = "Basic details";
export const PROFILE_ADDRESS_SECTION = "Address";
export const PROFILE_MY_TOURS_SECTION = "Your tours";
export const PROFILE_NO_TOURS_MESSAGE = "You have not signed up for a tour yet.";
export const PROFILE_PAYMENT_PENDING = "Payment pending";
export const PROFILE_PAYMENT_DEPOSIT_PAID = "Deposit paid";
export const PROFILE_PAYMENT_PAID = "Paid";
export const PROFILE_PAYMENT_CANCELLED = "Cancelled";
export const PROFILE_NEWSLETTER_SECTION = "Newsletter";
export const PROFILE_NEWSLETTER_SUBSCRIBE_LABEL = "Subscribe to the newsletter";
export const PROFILE_INCOMPLETE_WARNING =
  "Your name, phone number and address are not filled in. These are essential for signing up for a tour.";
export const PROFILE_BASIC_DATA_READONLY_INFO =
  "Your basic details cannot be edited. You can request a change by email or by phone.";
export const PROFILE_SIGNUP_DETAILS_SHOW = "Show sign-up details";
export const PROFILE_SIGNUP_DETAILS_HIDE = "Hide details";
export const PROFILE_TOURS_STAT_LABEL = "Tour sign-ups";
export const PROFILE_NEWSLETTER_HINT = "Be the first to hear about our upcoming tours.";

// Event signup confirmation
export const SIGNUP_BUTTON_LABEL = "Sign up";
export const SIGNUP_CONFIRM_TITLE = "Are you sure you want to sign up for this tour?";
export const SIGNUP_CONFIRM_YES = "Yes";
export const SIGNUP_CONFIRM_NO = "No";
export const SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL =
  "I am aware of the contents of the Terms and Conditions and the Privacy Policy, and I have read the travel contract";
export const SIGNUP_TOUR_INFO_IN_PROFILE =
  "The tour sign-up information is available in your profile. You will also receive an email about your sign-up with further information about the tour, the payment and the next steps.";
export const SIGNUP_LOGIN_REQUIRED = "To sign up, please";
export const SIGNUP_LOGIN_LINK = "log in";
export const SIGNUP_PROFILE_INCOMPLETE = "To sign up, please fill in";
export const SIGNUP_PROFILE_LINK = "your basic details and address in your profile";
export const SIGNUP_ALREADY_SIGNED_UP = "You have already signed up for this tour.";
export const SIGNUP_DEADLINE_PASSED_WARNING =
  "You can no longer sign up for this tour, the registration deadline has passed.";
export const SIGNUP_SUCCESS_TITLE = (eventTitle: string) => `Signed up: ${eventTitle}`;
export const SIGNUP_SUCCESS_CONTENT =
  "Thank you for signing up for our tour! We will be in touch soon!";
export const SIGNUP_SUCCESS_EMAIL_INFO = "We will email you about the next steps";
export const SIGNUP_SUCCESS_PROFILE_INFO =
  "The details of your sign-up are available in your profile";
export const SIGNUP_SUCCESS_OK_LABEL = "OK";
export const SIGNUP_ASZF_BUTTON_LABEL = "View Terms and Conditions";
export const SIGNUP_PRIVACY_BUTTON_LABEL = "Privacy Policy";
export const SIGNUP_TOUR_CONTRACT_LABEL = "Travel contract";

// Signup dialog steps
export const SIGNUP_DIALOG_TITLE_PREFIX = "Sign-up";
export const SIGNUP_STEP_BILLING = "Billing details";
export const SIGNUP_STEP_TRAVEL = "Travel details";
export const SIGNUP_STEP_COMPANIONS = "Fellow travellers";
export const SIGNUP_STEP_SUMMARY = "Summary";
export const SIGNUP_NEXT_LABEL = "Next";
export const SIGNUP_BACK_LABEL = "Back";
export const SIGNUP_CLOSE_LABEL = "Close";
export const SIGNUP_ABORT_CONFIRM_TITLE = "Abort";
export const SIGNUP_ABORT_CONFIRM_CONTENT =
  "Are you sure you want to abort the sign-up? The details you entered will be lost.";
export const SIGNUP_ABORT_CONFIRM_CANCEL = "Cancel";
export const SIGNUP_ABORT_CONFIRM_PROCEED = "Abort";

export const SIGNUP_VALIDATION = {
  required: "Required field",
  missingAddress: "Address missing from your profile",
  birthDateTooEarly: "The date of birth cannot be earlier than 01/01/1950",
  birthDateTooLate: "You must be at least 18 years old to sign up",
  issueDateOutOfRange: "The date of issue must be between the date of birth and today",
  issueDateAfterExpiry: "The date of issue must be earlier than the expiry date",
  expiryDateOutOfRange:
    "The expiry date must be between the date of issue and the current date + 30 years",
  expiryBeforeStartDate: "The document expires before the tour starts",
  taxNumberInvalid: `The tax number must be exactly ${TAX_NUMBER_DIGITS} digits (e.g. 12345678-1-42)`,
  companyNameTooLong: `The company name can be at most ${MAX_COMPANY_NAME} characters long`,
  birthCountryRequired: "Enter the name of the country",
  birthPlaceTooShort: `The name of the place must be at least ${MIN_PLACE_NAME} characters long`,
  documentNumberTooShort: `The document number must be at least ${MIN_DOCUMENT_NUMBER} characters long`,
};
export const SIGNUP_SUBMIT_LABEL = "Send";

// Billing step
export const SIGNUP_BILLING_INFO = "The details below are pre-filled from your profile.";
export const SIGNUP_BILLING_WANT_INVOICE = "I would like an invoice";
export const SIGNUP_BILLING_COMPANY_NAME = "Company name";
export const SIGNUP_BILLING_TAX_NUMBER = "Tax number";
export const SIGNUP_BILLING_ADDRESS_LABEL = "Address";

// Travel step
export const SIGNUP_TRAVEL_BIRTH_COUNTRY = "Country of birth";
export const SIGNUP_TRAVEL_BIRTH_PLACE = "Place of birth";
export const SIGNUP_TRAVEL_BIRTH_DATE = "Date of birth";
export const SIGNUP_TRAVEL_DOCUMENT_TYPE = "Type of travel document";
export const SIGNUP_TRAVEL_DOCUMENT_NUMBER = "Document number";
export const SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE = "Date of issue";
export const SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE = "Expiry date";
export const SIGNUP_TRAVEL_ALLERGIES = "Any allergy or illness we should know about (optional)";
export const SIGNUP_TRAVEL_FB_LINK = "Facebook profile link (optional)";
export const SIGNUP_TRAVEL_FB_INFO =
  "We ask for your Facebook link so we can invite you to the group that makes communication easier. We share the latest information about the tour in that group.";
export const SIGNUP_DOCUMENT_TYPE_PASSPORT = "Passport";
export const SIGNUP_DOCUMENT_TYPE_ID_CARD = "ID card";
export const SIGNUP_DOCUMENT_TYPE_STUDENT_CARD = "Student card";

// Companions step
export const SIGNUP_BIRTH_COUNTRY_OTHER = "Other";
export const SIGNUP_COMPANION_ADD_BUTTON = "Add a fellow traveller";
export const SIGNUP_COMPANION_INFO =
  'If you would like to register someone else for the tour, click the "Add a fellow traveller" button.';
export const SIGNUP_COMPANION_MAX_INFO =
  "At most 5 fellow travellers can be added online. If more of you would like to join, please contact us by phone or in person first.";
export const SIGNUP_COMPANION_TITLE = (i: number) => `Fellow traveller ${i}`;
export const SIGNUP_COMPANION_REMOVE = "Remove";

// Summary step
export const SIGNUP_SUMMARY_TRAVELER_UNIT = "person(s)";
export const SIGNUP_SUMMARY_TRAVELERS = "Number of travellers";
export const SIGNUP_SUMMARY_TRAVELER_NAMES = "Names of travellers";
export const SIGNUP_SUMMARY_SCHEDULE = "Schedule";
export const SIGNUP_SUMMARY_TOTAL_PRICE = "Total amount payable";
export const SIGNUP_SUMMARY_NOTES = "Note (optional)";

// Gallery slideshow (nav arrows, dots, play/pause)
export const GALLERY_PREV_IMAGE_ARIA = "Previous image";
export const GALLERY_NEXT_IMAGE_ARIA = "Next image";
export const GALLERY_DOT_IMAGE_ARIA = (idx: number) => `Image ${idx + 1}`;
export const GALLERY_POSITION_LABEL = (current: number, total: number) => `${current} / ${total}`;
export const GALLERY_POSITION_ARIA = (current: number, total: number) =>
  `Image ${current} of ${total}.`;
export const GALLERY_PAUSE_ARIA = "Stop automatic slideshow";
export const GALLERY_PLAY_ARIA = "Start automatic slideshow";

// Footer social links
export const FOOTER_FACEBOOK_ARIA = "Visit our Facebook page";
export const FOOTER_INSTAGRAM_ARIA = "Visit our Instagram page";
export const FOOTER_TIKTOK_ARIA = "Visit our TikTok page";
export const FOOTER_YOUTUBE_ARIA = "Visit our YouTube page";

// Socials block
export const SOCIALS_EMBED_LOAD_ERROR =
  "The content could not be loaded. This is often caused by an ad blocker (AdBlock) browser extension - please turn it off and reload the page.";
export const SOCIALS_FACEBOOK_LABEL = "Facebook";
export const SOCIALS_INSTAGRAM_LABEL = "Instagram";
export const SOCIALS_TIKTOK_LABEL = "TikTok";
export const SOCIALS_YOUTUBE_LABEL = "YouTube";

// Cookie consent - banner
export const COOKIE_BANNER_TITLE = "Use of cookies";
export const COOKIE_BANNER_DESCRIPTION =
  "This website uses cookies and similar technologies to operate, to keep logins secure and to collect visitor statistics. By accepting functional and analytics cookies you consent to data being collected for Google.";
export const COOKIE_BANNER_ACCEPT_ALL = "Accept";
export const COOKIE_BANNER_DECLINE = "Decline";
export const COOKIE_BANNER_SETTINGS = "Settings";

// Cookie consent - preferences dialog
export const COOKIE_PREFS_TITLE = "Cookie settings";
export const COOKIE_PREFS_ACCEPT_ALL = "Accept all";
export const COOKIE_PREFS_REJECT_ALL = "Reject all";
export const COOKIE_PREFS_SAVE = "Save";
export const COOKIE_PREFS_CLOSE = "Close";

// Cookie consent - categories
export const COOKIE_NECESSARY_TITLE = "Necessary cookies";
export const COOKIE_NECESSARY_DESCRIPTION =
  "These cookies are essential for the basic operation of the website. Without them the site cannot work properly.";
export const COOKIE_FUNCTIONAL_TITLE = "Functional cookies";
export const COOKIE_FUNCTIONAL_DESCRIPTION =
  "The Google reCAPTCHA v3 service helps filter out automated bots when forms are submitted. It sends data to Google (IP address, browser data).";
export const COOKIE_ANALYTICS_TITLE = "Analytics";
export const COOKIE_ANALYTICS_DESCRIPTION =
  "These cookies help us understand how visitors use the website and allow us to improve the user experience. Google Analytics collects anonymous statistics about site usage.";

// Cookie consent - table headers
export const COOKIE_TABLE_NAME = "Name";
export const COOKIE_TABLE_DOMAIN = "Domain";
export const COOKIE_TABLE_EXPIRATION = "Expiry";
export const COOKIE_TABLE_DESCRIPTION = "Description";

// Cookie consent - cookie descriptions
export const COOKIE_JWT_DESC = "Login session identifier";
export const COOKIE_EMAIL_DESC = "Email address of the logged-in user";
export const COOKIE_CC_DESC = "Cookie consent preferences";
export const COOKIE_RECAPTCHA_DESC = "Google reCAPTCHA bot detection";
export const COOKIE_GA_DESC = "Distinguishes users (Google Analytics)";
export const COOKIE_GA_SESSION_DESC = "Preserves session state (Google Analytics)";

// Contact request form
export const CONTACT_REQUEST_TITLE = "Get in touch";
export const CONTACT_REQUEST_SUBTITLE_PREFIX = "Not ready to create an ";
export const CONTACT_REQUEST_SUBTITLE_LINK = "account";
export const CONTACT_REQUEST_SUBTITLE_SUFFIX =
  " yet? Is hiking still new to you and you would rather hear more about it first? No problem! Give us a few details and we will get in touch with you.";
export const CONTACT_REQUEST_NAME_LABEL = "Your name";
export const CONTACT_REQUEST_PHONE_LABEL = "Your phone number";
export const CONTACT_REQUEST_EMAIL_LABEL = "Your email address";
export const CONTACT_REQUEST_PREFERRED_LABEL = "How should we contact you?";
export const CONTACT_REQUEST_PHONE_OPTION = "Contact me by phone";
export const CONTACT_REQUEST_EMAIL_OPTION = "Contact me by email";
export const CONTACT_REQUEST_SUBMIT_LABEL = "Send";
export const CONTACT_REQUEST_NEW_REQUEST_LABEL = "Send another";

// Calendar
export const CALENDAR_DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const CALENDAR_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const CALENDAR_TODAY_LABEL = "Today";
export const DATE_INVALID = "Invalid date";

// Cookie consent - data values
export const COOKIE_DOMAIN_SITE = "this website";
export const COOKIE_DOMAIN_GOOGLE = "google.com";
export const COOKIE_EXPIRY_7_DAYS = "7 days";
export const COOKIE_EXPIRY_6_MONTHS = "6 months";
export const COOKIE_EXPIRY_1_YEAR = "1 year";
export const COOKIE_EXPIRY_2_YEARS = "2 years";

// Strapi page slugs - see the note in texts-client.ts. Each of these needs an English
// translation of the page in Strapi, saved under exactly this slug.
export const TERMS_LINK = "/terms";
export const PRIVACY_LINK = "/privacy-policy";
export const TRAVEL_CONTRACT_LINK = "/travel-contract";

export const REPORTS_PAGE_SLUG = "reports";
export const BLOG_PAGE_SLUG = "blog";
