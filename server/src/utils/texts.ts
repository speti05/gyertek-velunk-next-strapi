/**
 * Central language file for every user-facing Hungarian string the backend produces:
 * e-mail subjects and bodies, the HTML pages Strapi serves itself, and API error
 * messages returned to the client.
 *
 * Mirrors the client's `client/src/utils/texts.tsx`: each string lives here under a
 * named key and is imported where it is used, so no module carries a literal of its
 * own. Strings that embed runtime values are exported as functions.
 *
 * Markup stays in the templates — a value interpolated into a sentence is passed in
 * already wrapped (e.g. `<strong>…</strong>`) so the whole sentence stays in one key.
 */

// Brand
export const SITE_NAME = "Gyertek velünk";
export const EMAIL_DEFAULT_FROM_NAME = SITE_NAME;

// E-mail header banner titles. Also the enum used as the subject type across templates.
export enum SystemEmailSubject {
  EmailConfirmation = "Email cím megerősítése",
  ForgotPassword = "Elfelejtett jelszó",
  EventSignup = "Túrajelentkezés megerősítése",
  EventSignupAdmin = "Új túrajelentkezés",
  NewsletterSignup = "Hírlevél feliratkozás",
  ContactRequestAdmin = "Új visszahívás / megkeresés",
  ContactRequest = "Kapcsolatfelvételi kérés",
}

// E-mail layout
export const EMAIL_HEADER_LOGO_ALT = SITE_NAME;
export const EMAIL_FOOTER_RIGHTS = "Minden jog fenntartva.";
export const EMAIL_GREETING = (name: string) => `Kedves ${name},`;
export const EMAIL_SIGNATURE_CLOSING = "Üdvözlettel,";
export const EMAIL_SIGNATURE_TEAM = (organizationName: string) => `A ${organizationName} csapata`;
export const EMAIL_FALLBACK_LINK_LABEL = "Ha a gomb nem működik, másold be ezt a linket:";

// Shared field labels
export const LABEL_NAME = "Név";
export const LABEL_EMAIL = "Email";
export const LABEL_EMAIL_ADDRESS = "Email cím";
export const LABEL_PHONE = "Telefonszám";
export const LABEL_YES = "Igen";
export const LABEL_NO = "Nem";

// Contact request — envelope
export const CONTACT_REQUEST_FROM_NAME = (organizationName: string) =>
  `${organizationName} Kapcsolatfelvétel`;
export const CONTACT_REQUEST_ADMIN_MAIL_SUBJECT = "Új visszahívás / megkeresés";
export const CONTACT_REQUEST_USER_MAIL_SUBJECT = "Megkaptuk a megkeresésedet";

// Contact request — preferred way of getting in touch
export const CONTACT_PREFERENCE_PHONE_LABEL = "Telefonon";
export const CONTACT_PREFERENCE_EMAIL_LABEL = "Emailben";
export const CONTACT_PREFERENCE_PHONE_SENTENCE = "telefonon, a megadott telefonszámon";
export const CONTACT_PREFERENCE_EMAIL_SENTENCE = "emailben, a megadott email címen";

// Contact request — admin notification
export const CONTACT_REQUEST_ADMIN_TITLE = "Új visszahívás / megkeresés érkezett";
export const CONTACT_REQUEST_ADMIN_INTRO =
  "Az alábbi személy szeretné felvenni veletek a kapcsolatot.";
export const CONTACT_REQUEST_ADMIN_SECTION_TITLE = "Adatok";
export const CONTACT_REQUEST_ADMIN_PREFERENCE_LABEL = "Kapcsolatfelvétel";

// Contact request — confirmation to the requester
export const CONTACT_REQUEST_USER_BADGE = "Megkeresés fogadva";
export const CONTACT_REQUEST_USER_TITLE = "Megkaptuk a megkeresésedet!";
export const CONTACT_REQUEST_USER_INTRO = (preferenceSentence: string) =>
  `Köszönjük, hogy jelezted a kapcsolatfelvételi igényedet! Hamarosan felvesszük veled a kapcsolatot ${preferenceSentence}.`;
export const CONTACT_REQUEST_USER_PREFERENCE_LABEL = "Kapcsolatfelvétel módja";
export const CONTACT_REQUEST_USER_OUTRO =
  "Ha időközben megváltozna az elérhetőséged, vagy bármi kérdésed van, egyszerűen válaszolj erre a levélre.";

// Contact request — API errors
export const CONTACT_REQUEST_DUPLICATE_ERROR = (windowHours: number) =>
  `Ezzel a kapcsolati adattal ${windowHours} órán belül már érkezett megkeresés.`;

// Event signup — envelope
export const EVENT_SIGNUP_FROM_NAME = (organizationName: string) =>
  `${organizationName} Túrajelentkezés`;
export const EVENT_SIGNUP_USER_MAIL_SUBJECT = (eventName: string) =>
  `Sikeres túrajelentkezés – ${eventName}`;
export const EVENT_SIGNUP_ADMIN_MAIL_SUBJECT = (eventName: string) =>
  `Túrajelentkezés: ${eventName}`;

// Event signup — confirmation to the applicant
export const EVENT_SIGNUP_USER_BADGE = "Sikeres jelentkezés";
export const EVENT_SIGNUP_USER_TITLE = "Megkaptuk a jelentkezésedet!";
export const EVENT_SIGNUP_USER_INTRO =
  "Köszönjük a jelentkezésedet! Örömmel értesítünk, hogy regisztrációdat sikeresen fogadtuk.";
export const EVENT_SIGNUP_SELECTED_TOUR_LABEL = "Kiválasztott túra";
export const EVENT_SIGNUP_USER_GLAD = "Örülünk, hogy velünk tartasz.";
export const EVENT_SIGNUP_USER_PAYMENT_INTRO =
  "A jelentkezésedet megkaptuk, a foglalásod az előleg beérkezése után válik véglegessé. Ajelentkezési részleteket megtalálod a profilodban.Az utaláshoz szükséges adatokat lent találod:";
export const EVENT_SIGNUP_USER_QUESTIONS = (contactEmailLink: string) =>
  `Ha bármi kérdésed van, nyugodtan írj nekünk az ${contactEmailLink} email címre.`;
export const EVENT_SIGNUP_USER_ATTACHMENT_NOTE = (contractName: string) =>
  `Csatolmányban megtalálod az ${contractName}.`;
export const EVENT_SIGNUP_CONTRACT_NAME_ACCUSATIVE = "utazási szerződést";
export const EVENT_SIGNUP_USER_SEE_YOU = "Hamarosan találkozunk! ⛰️";

// Event signup — bank transfer details
export const CURRENCY_FALLBACK = "Pénzegység";
export const TRANSFER_SECTION_TITLE = "Utalási adatok";
export const TRANSFER_AMOUNT_LABEL = "Fizetendő összeg:";
export const TRANSFER_BENEFICIARY_LABEL = "Kedvezményezett:";
export const TRANSFER_ACCOUNT_NUMBER_LABEL = "Bankszámlaszám:";
export const TRANSFER_REFERENCE_LABEL = "Közlemény:";

// Event signup — what happens next
export const EVENT_SIGNUP_NEXT_STEPS_TITLE =
  "A következő időszakban ezeken fogunk együtt végigmenni:";
export const EVENT_SIGNUP_NEXT_STEPS = [
  "Az utalásod beérkezése után telefonon is felvesszük veled a kapcsolatot, ahol megbeszéljük a további kommunikáció részleteit. Facebookon is felvesszük egymást, illetve bekerülsz a közös Messenger csoportba is.",
  "Ezt követően elküldjük neked a túra részletesebb leírását és a szükséges felszereléslistát. Ez még nem a végleges tájékoztató, a célja inkább az, hogy időben képbe kerülj a túrával kapcsolatban és nyugodtan fel tudj készülni.",
  "Az egyik legfontosabb lépés a repülőjegy lefoglalása. Ezt alapvetően minden résztvevő önállóan intézi, azonban igény esetén felár ellenében természetesen segítünk a foglalásban is.",
  "Utasbiztosítás megkötése kötelező, melynek meglétét indulás előtt ellenőrizzük. Amennyiben szeretnéd, felár ellenében ebben is tudunk segíteni.",
  "Körülbelül egy hónappal az indulás előtt megküldjük a végleges tájékoztatót, a pontos menetrendet és minden fontos indulási információt.",
];

// Event signup — admin notification
export const EVENT_SIGNUP_ADMIN_TITLE = "Új túrajelentkezés érkezett";
export const EVENT_SIGNUP_ADMIN_INTRO = "Az alábbi személy regisztrált az egyik túrátokra.";
export const EVENT_SIGNUP_SECTION_TOUR = "Túra";
export const EVENT_SIGNUP_SECTION_APPLICANT = "Jelentkező adatai";
export const EVENT_SIGNUP_SECTION_INVOICING = "Számlázás";
export const EVENT_SIGNUP_SECTION_TRAVEL_DATA = "Utazási adatok";
export const EVENT_SIGNUP_SECTION_NOTES = "Megjegyzés";
export const EVENT_SIGNUP_COMPANION_SECTION_TITLE = (index: number) => `${index}. kísérő adatai`;

// Event signup — admin notification field labels
export const LABEL_TOUR_NAME = "Túra neve";
export const LABEL_BILLING_COUNTRY = "Számlázási cím (ország)";
export const LABEL_BILLING_ADDRESS = "Számlázási cím";
export const LABEL_WANTS_INVOICE = "Kér számlát";
export const LABEL_COMPANY_NAME = "Cégnév";
export const LABEL_TAX_NUMBER = "Adószám";
export const LABEL_BIRTH_COUNTRY = "Születési ország";
export const LABEL_BIRTH_PLACE = "Születési hely";
export const LABEL_BIRTH_DATE = "Születési dátum";
export const LABEL_DOCUMENT_TYPE = "Okmány típusa";
export const LABEL_DOCUMENT_NUMBER = "Okmány száma";
export const LABEL_DOCUMENT_ISSUE_DATE = "Kiállítás dátuma";
export const LABEL_DOCUMENT_EXPIRY_DATE = "Lejárat dátuma";
export const LABEL_ALLERGIES = "Allergiák / egészségügyi info";
export const LABEL_FACEBOOK_PROFILE = "Facebook profil";
export const LABEL_NOTES = "Megjegyzés";

// Travel contract attachment
export const TRAVEL_CONTRACT_DOCUMENT_TITLE = "Utazási szerződés";

// Newsletter signup — envelope
export const NEWSLETTER_SIGNUP_USER_MAIL_SUBJECT = "Sikeres hírlevél feliratkozás";
export const NEWSLETTER_SIGNUP_ADMIN_MAIL_SUBJECT = "Új hírlevél feliratkozás";

// Newsletter signup — confirmation to the subscriber
export const NEWSLETTER_SIGNUP_USER_TITLE = "Sikeresen feliratkoztál!";
export const NEWSLETTER_SIGNUP_USER_INTRO = (siteName: string) =>
  `Örömmel értesítünk, hogy sikeresen feliratkoztál a ${siteName} hírlevelére! Hamarosan értesítünk a legújabb túráinkról, eseményeinkről és híreinkről&nbsp;:)`;
export const NEWSLETTER_SIGNUP_USER_DISCLAIMER =
  "Ha nem te iratkoztál fel erre az email címre, hagyd figyelmen kívül ezt az üzenetet.";

// Newsletter signup — admin notification
export const NEWSLETTER_SIGNUP_ADMIN_TITLE = "Új hírlevél feliratkozás";
export const NEWSLETTER_SIGNUP_ADMIN_INTRO = "Az alábbi email cím feliratkozott a hírlevélre.";
export const NEWSLETTER_SIGNUP_ADMIN_SECTION_TITLE = "Feliratkozó adatai";

// Newsletter broadcast
export const NEWSLETTER_HEADER_LOGO_ALT = `${SITE_NAME} hírlevél`;
export const NEWSLETTER_UNSUBSCRIBE_QUESTION = "Nem szeretnél több hírlevelet kapni?";
export const NEWSLETTER_UNSUBSCRIBE_LINK_LABEL = "Leiratkozás";

// Unsubscribe landing page
export const UNSUBSCRIBE_ERROR_TITLE = "Hiba";
export const UNSUBSCRIBE_INCOMPLETE_LINK = "Hiányos leiratkozási link.";
export const UNSUBSCRIBE_INVALID_LINK = "Érvénytelen vagy lejárt link.";
export const UNSUBSCRIBE_SUCCESS_TITLE = "Sikeres leiratkozás";
export const UNSUBSCRIBE_SUCCESS_MESSAGE = "Sikeresen leiratkoztál a hírlevelünkről.";
export const GO_HOME_LABEL = "Vissza a főoldalra";

// Email address confirmation (template generated for the Strapi admin)
export const EMAIL_CONFIRMATION_INTRO =
  "Köszönjük, hogy regisztráltál az oldalunkon! Az alábbi gombra kattintva erősítsd meg az email címedet, és máris elkezdheted használni a fiókodat&nbsp;:)";
export const EMAIL_CONFIRMATION_BUTTON_LABEL = "Email cím megerősítése";
export const EMAIL_CONFIRMATION_DISCLAIMER =
  "Ha nem te regisztráltál erre az oldalra, kérjük, hagyd figyelmen kívül ezt az emailt.";

// Password reset (template generated for the Strapi admin)
export const RESET_PASSWORD_INTRO =
  "Új jelszót igényeltél az oldalunkon. Az alábbi gombra kattintva megadhatod az új használni kívánt jelszavadat. De ezt most már el ne hagyd&nbsp;:)";
export const RESET_PASSWORD_BUTTON_LABEL = "Jelszó visszaállítása";
export const RESET_PASSWORD_DISCLAIMER =
  "Ha nem te kérted a jelszó visszaállítását, kérjük jelezd felénk mielőbb!";
