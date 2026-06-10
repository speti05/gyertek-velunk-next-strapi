// Events
export const FEATURED_EVENTS_LABEL = "Kiemelt túrák";
export const FEATURED_EVENTS_SEARCH_LABEL = "Keresés a kiemelt túrák között";
export const EVENTS_LABEL = "Túráink";
export const EVENTS_SEARCH_LABEL = "Keresés az túrák között";

// Articles
export const FEATURED_ARTICLES_LABEL = "Kiemelt beszámolók";
export const FEATURED_ARTICLES_SEARCH_LABEL = "Keresés a kiemelt beszámolók között";
export const ARTICLES_LABEL = "Beszámolóink";
export const ARTICLES_SEARCH_LABEL = "Keresés a beszámolók között";

export const TOUR_CALENDAR_LABEL = "Túranaptár";

// Metadata
export const SITE_TITLE = "Gyertek Velünk";
export const SITE_DESCRIPTION = "Túrák magyarországon és külföldön.";

// General
export const DIALOG_CONFIRM_LABEL = "OK";
export const DIALOG_CANCEL_LABEL = "Mégse";
export const LOADING_LABEL = "Töltés...";
export const GO_HOME_LABEL = "Vissza a főoldalra";
export const SERVER_SIDE_ERROR_LABEL = "Szerver oldali hiba.";
export const PAGE_NOT_FOUND_LABEL = "Az oldal nem található.";
export const ERROR_LABEL = "Hiba történt. Próbáld újra később.";
export const NOT_FOUND_LABEL = "Sajnáljuk, ez az oldal jól elvándorolt.";
export const TRY_AGAIN_LABEL = "Próbáld újra";

export const FORM_LABELS = {
  firstName: "Keresztnév",
  lastName: "Vezetéknév",
  email: "Email",
  telephone: "Telefon",
  phone: "Telefonszám",
  submit: "Regisztráció",
  startDate: "Kezdés dátuma",
  price: "Részvételi díj",
};

export const MESSAGES = {
  emailInvalid: "Érvényes email címet adj meg",
  invalidFirstName: "Add meg a keresztneved",
  invalidLastName: "Add meg a vezetékneved",
  invalidTelephone: "Érvényes telefonszámot adj meg. ",
  enterPhoneNumber: "Add meg a telefonszámod. ",
  someThingWentWrong: "Hiba történt. Kérjük, próbáld újra később.",
  failedToSubscribe: "Sikertelen feliratkozás.",
  succesfullySubscribed: "Sikeresen feliratkoztál a hírlevelünkre!",
  emailAlreadySubscribed: "Ez az email cím már fel van iratkozva a hírlevélre.",
  failedToSubscribeToEvent: "Sikertelen jelentkezés.",
  succesfullySubscribedToEvent: "Sikeres jelentkezés.",
  recaptchaFailed: "A biztonsági ellenőrzés sikertelen. Kérjük, próbálja újra.",
  invalidPassword: "A jelszónak legalább 6 és legfeljebb 15 karakter hosszúnak kell lennie",
  loginFailed: "Hibás email cím vagy jelszó.",
  emailAlreadyTaken: "Ez az email cím már regisztrálva van.",
  registrationFailed: "Sikertelen regisztráció. Kérjük, próbálja újra.",
  invalidOperation: "Érvénytelen művelet.",
  tryAgain: "Hiba történt. Kérjük, próbálja újra.",
  passwordMismatch: "A két jelszó nem egyezik meg.",
  passwordNeedsUppercase: "A jelszónak tartalmaznia kell legalább egy nagybetűt.",
  passwordNeedsLowercase: "A jelszónak tartalmaznia kell legalább egy kisbetűt.",
  passwordNeedsSpecial: "A jelszónak tartalmaznia kell legalább egy speciális karaktert.",
  registrationEmailSent:
    "Regisztráció sikeres! Kérjük, erősítsd meg az email címedet a kiküldött levélben lévő linkre kattintva.",
  confirmEmailSuccess: "Az email cím sikeresen megerősítve! Most már bejelentkezhetsz.",
  confirmEmailFailed: "Az email cím megerősítése sikertelen. A link érvénytelen vagy lejárt.",
  confirmEmailInvalidLink: "Érvénytelen megerősítési link.",
  profileSaveSuccess: "Az adataid sikeresen elmentve.",
  profileSaveFailed: "Mentés sikertelen. Kérjük, próbáld újra.",
  missingProfileData: "Kérjük, töltsd ki a profilodon az alapadatokat a jelentkezés előtt.",
  loginRequired: "A jelentkezéshez kérjük, jelentkezz be.",
  newsletterSubscribeSuccess: "Sikeresen feliratkoztál a hírlevélre.",
  newsletterUnsubscribeSuccess: "Sikeresen leiratkoztál a hírlevélről.",
  newsletterToggleFailed: "Hiba történt. Kérjük, próbálja újra.",
};

// Auth
export const AUTH_LOGIN_LABEL = "Bejelentkezés";
export const AUTH_REGISTER_LABEL = "Regisztráció";
export const AUTH_LOGOUT_LABEL = "Kijelentkezés";
export const AUTH_PASSWORD_LABEL = "Jelszó";
export const AUTH_DIVIDER_LABEL = "vagy";
export const AUTH_NO_ACCOUNT_HINT = "Még nincs fiókod?";
export const AUTH_WELCOME_MESSAGE = "Örülünk, hogy itt vagy.";
export const AUTH_PROFILE_NAV_LABEL = "Profilod";
export const AUTH_HELLO = (name: string) => `Helló, ${name}!`;
export const AUTH_FORGOT_PASSWORD_LABEL = "Elfelejtett jelszó?";
export const AUTH_FORGOT_PASSWORD_TITLE = "Elfelejtett jelszó";
export const AUTH_FORGOT_PASSWORD_SUCCESS =
  "Ha ez az email cím regisztrálva van, hamarosan kapsz egy linket. A link 1 óráig érvényes.";
export const AUTH_RESET_PASSWORD_TITLE = "Új jelszó beállítása";
export const AUTH_NEW_PASSWORD_LABEL = "Új jelszó";
export const AUTH_CONFIRM_PASSWORD_LABEL = "Jelszó megerősítése";
export const AUTH_BACK_TO_LOGIN = "← Vissza a bejelentkezéshez";
export const AUTH_HAS_ACCOUNT_HINT = "Már van fiókod?";
export const AUTH_CONFIRM_EMAIL_TITLE = "Email megerősítés";

export const PASSWORD_RULES = [
  { label: "Legalább 6, legfeljebb 15 karakter", test: (p: string) => p.length >= 6 && p.length <= 15 },
  { label: "Kis- és nagybetű", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "Speciális karakter (pl. !@#$%)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];
export const AUTH_INVALID_RESET_LINK = "Érvénytelen vagy lejárt link.";
export const AUTH_SAVE_LABEL = "Mentés";
export const AUTH_SHOW_PASSWORD_LABEL = "Jelszó megjelenítése";
export const AUTH_HIDE_PASSWORD_LABEL = "Jelszó elrejtése";
export const AUTH_TERMS_ACCEPT_PREFIX = "Elolvastam és elfogadom az ";
export const AUTH_TERMS_LINK_LABEL = "ÁSZF-et";
export const AUTH_TERMS_ACCEPT_SUFFIX = ".";
export const AUTH_TERMS_REQUIRED_ERROR = "Az ÁSZF elfogadása kötelező a regisztrációhoz.";

// Profile
export const PROFILE_TITLE = "Profilom";
export const PROFILE_BASIC_DATA_SECTION = "Alapadatok";
export const PROFILE_MY_TOURS_SECTION = "Túráim";
export const PROFILE_NO_TOURS_MESSAGE = "Még nem jelentkeztél túrára.";
export const PROFILE_PAYMENT_PAID = "Befizetve";
export const PROFILE_PAYMENT_UNPAID = "Befizetés folyamatban";
export const PROFILE_NEWSLETTER_SECTION = "Hírlevél";
export const PROFILE_NEWSLETTER_SUBSCRIBE_LABEL = "Feliratkozom a hírlevélre";
export const PROFILE_INCOMPLETE_WARNING =
  "A neved és telefonszámod nincs kitöltve. Ezek elengedhetetlenek a túrajelentkezéshez.";

// Event signup confirmation
export const SIGNUP_BUTTON_LABEL = "Jelentkezés";
export const SIGNUP_CONFIRM_TITLE = "Biztos, hogy jelentkezel erre a túrára?";
export const SIGNUP_CONFIRM_YES = "Igen";
export const SIGNUP_CONFIRM_NO = "Nem";
export const SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL =
  "Elfogadom a feltételeket, várom a tájékoztató emailt a túráról";
export const SIGNUP_TOUR_INFO_IN_PROFILE =
  "A túrajelentkezési információk megtalálhatók a profilodban";
export const SIGNUP_LOGIN_REQUIRED = "A jelentkezéshez kérjük,";
export const SIGNUP_LOGIN_LINK = "jelentkezz be";
export const SIGNUP_PROFILE_INCOMPLETE = "A jelentkezéshez kérjük, töltsd ki az";
export const SIGNUP_PROFILE_LINK = "alapadataidat a profilodon";
export const SIGNUP_ALREADY_SIGNED_UP = "Már jelentkeztél erre a túrára.";

// Footer social links
export const FOOTER_FACEBOOK_ARIA = "Látogass el Facebook oldalunkra";
export const FOOTER_INSTAGRAM_ARIA = "Látogass el Instagram oldalunkra";
export const FOOTER_TIKTOK_ARIA = "Látogass el TikTok oldalunkra";

// Cookie consent - banner
export const COOKIE_BANNER_TITLE = "Sütik használata";
export const COOKIE_BANNER_DESCRIPTION =
  "Ez a weboldal sütiket és hasonló technológiákat használ a működéséhez, a biztonságos bejelentkezéshez és a látogatói statisztikákhoz. A funkcionális és analitikai sütik elfogadásával hozzájárulsz adatok gyűjtéséhez a Google számára.";
export const COOKIE_BANNER_ACCEPT_ALL = "Elfogadom";
export const COOKIE_BANNER_DECLINE = "Elutasítom";
export const COOKIE_BANNER_SETTINGS = "Beállítások";

// Cookie consent - preferences dialog
export const COOKIE_PREFS_TITLE = "Cookie beállítások";
export const COOKIE_PREFS_ACCEPT_ALL = "Összes elfogadása";
export const COOKIE_PREFS_REJECT_ALL = "Összes elutasítása";
export const COOKIE_PREFS_SAVE = "Mentés";
export const COOKIE_PREFS_CLOSE = "Bezárás";

// Cookie consent - categories
export const COOKIE_NECESSARY_TITLE = "Szükséges sütik";
export const COOKIE_NECESSARY_DESCRIPTION =
  "Ezek a sütik elengedhetetlenek a weboldal alapvető működéséhez. Nélkülük az oldal nem tud megfelelően működni.";
export const COOKIE_FUNCTIONAL_TITLE = "Funkcionális sütik";
export const COOKIE_FUNCTIONAL_DESCRIPTION =
  "A Google reCAPTCHA v3 szolgáltatás segít kiszűrni az automatizált robotokat az űrlapok beküldésekor. Adatokat továbbít a Google számára (IP-cím, böngészőadatok).";
export const COOKIE_ANALYTICS_TITLE = "Analitika";
export const COOKIE_ANALYTICS_DESCRIPTION =
  "Ezek a sütik segítenek megérteni, hogyan használják a látogatók a weboldalt, és lehetővé teszik a felhasználói élmény javítását. A Google Analytics névtelen statisztikákat gyűjt az oldalhasználatról.";

// Cookie consent - table headers
export const COOKIE_TABLE_NAME = "Név";
export const COOKIE_TABLE_DOMAIN = "Domain";
export const COOKIE_TABLE_EXPIRATION = "Lejárat";
export const COOKIE_TABLE_DESCRIPTION = "Leírás";

// Cookie consent - cookie descriptions
export const COOKIE_JWT_DESC = "Bejelentkezési munkamenet azonosítója";
export const COOKIE_EMAIL_DESC = "Bejelentkezett felhasználó email-je";
export const COOKIE_CC_DESC = "Cookie-hozzájárulási beállítások";
export const COOKIE_RECAPTCHA_DESC = "Google reCAPTCHA bot-azonosítás";
export const COOKIE_GA_DESC = "Megkülönbözteti a felhasználókat (Google Analytics)";
export const COOKIE_GA_SESSION_DESC = "Munkamenet állapotának megőrzése (Google Analytics)";

// Cookie consent - data values
export const COOKIE_DOMAIN_SITE = "saját weboldal";
export const COOKIE_DOMAIN_GOOGLE = "google.com";
export const COOKIE_EXPIRY_7_DAYS = "7 nap";
export const COOKIE_EXPIRY_6_MONTHS = "6 hónap";
export const COOKIE_EXPIRY_1_YEAR = "1 év";
export const COOKIE_EXPIRY_2_YEARS = "2 év";
