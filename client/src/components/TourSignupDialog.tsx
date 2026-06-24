"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import CustomStepper from "@/components/custom-ui-components/custom-stepper/custom-stepper";
import Divider from "@mui/material/Divider";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import { CustomConfirmDialog } from "@/components/custom-ui-components/custom-confirm-dialog/custom-confirm-dialog";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomSelect } from "@/components/custom-ui-components/custom-select/custom-select";
import { CustomCheckbox } from "@/components/custom-ui-components/custom-checkbox/custom-checkbox";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { UserProfile } from "@/data/auth-service";
import { formatDate } from "@/utils/format-date";
import { EUROPEAN_COUNTRIES, DEFAULT_COUNTRY } from "@/utils/european-countries";
import {
  FORM_LABELS,
  CURRENCY,
  SIGNUP_STEP_BILLING,
  SIGNUP_STEP_TRAVEL,
  SIGNUP_STEP_COMPANIONS,
  SIGNUP_STEP_SUMMARY,
  SIGNUP_NEXT_LABEL,
  SIGNUP_BACK_LABEL,
  SIGNUP_SUBMIT_LABEL,
  SIGNUP_BILLING_INFO,
  SIGNUP_BILLING_WANT_INVOICE,
  SIGNUP_BILLING_COMPANY_NAME,
  SIGNUP_BILLING_TAX_NUMBER,
  SIGNUP_TRAVEL_BIRTH_COUNTRY,
  SIGNUP_TRAVEL_BIRTH_PLACE,
  SIGNUP_TRAVEL_BIRTH_DATE,
  SIGNUP_TRAVEL_DOCUMENT_TYPE,
  SIGNUP_TRAVEL_DOCUMENT_NUMBER,
  SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE,
  SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE,
  SIGNUP_TRAVEL_ALLERGIES,
  SIGNUP_TRAVEL_FB_LINK,
  SIGNUP_TRAVEL_FB_INFO,
  SIGNUP_DOCUMENT_TYPE_PASSPORT,
  SIGNUP_DOCUMENT_TYPE_ID_CARD,
  SIGNUP_DOCUMENT_TYPE_STUDENT_CARD,
  SIGNUP_COMPANION_ADD_BUTTON,
  SIGNUP_COMPANION_INFO,
  SIGNUP_COMPANION_MAX_INFO,
  SIGNUP_COMPANION_TITLE,
  SIGNUP_COMPANION_REMOVE,
  SIGNUP_SUMMARY_TRAVELER_UNIT,
  SIGNUP_SUMMARY_TRAVELERS,
  SIGNUP_SUMMARY_TRAVELER_NAMES,
  SIGNUP_SUMMARY_SCHEDULE,
  SIGNUP_SUMMARY_TOTAL_PRICE,
  SIGNUP_SUMMARY_NOTES,
  SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL,
  SIGNUP_ASZF_BUTTON_LABEL,
  SIGNUP_PRIVACY_BUTTON_LABEL,
  SIGNUP_TOUR_INFO_IN_PROFILE,
  SIGNUP_CLOSE_LABEL,
  SIGNUP_DIALOG_TITLE_PREFIX,
  SIGNUP_ABORT_CONFIRM_TITLE,
  SIGNUP_ABORT_CONFIRM_CONTENT,
  SIGNUP_ABORT_CONFIRM_CANCEL,
  SIGNUP_ABORT_CONFIRM_PROCEED,
  SIGNUP_VALIDATION,
} from "@/utils/texts";
import Typography from "@mui/material/Typography";
import { colors } from "@/sass/mui-override/colors";
import {
  MAX_COMPANY_NAME,
  TAX_NUMBER_DIGITS,
  TAX_NUMBER_DISPLAY_MAX,
  MIN_PLACE_NAME,
  MAX_PLACE_NAME,
  MAX_PHONE,
  MIN_DOCUMENT_NUMBER,
  MAX_DOCUMENT_NUMBER,
  MAX_ALLERGIES,
  MAX_FB_LINK,
  MAX_NAME,
  MAX_NOTES,
} from "@/components/custom-ui-components/custom-text-input/input-length-limits";

function formatTaxNumberDisplay(digits: string): string {
  if (digits.length <= 8) return digits;
  if (digits.length === 9) return `${digits.slice(0, 8)}-${digits.slice(8)}`;
  if (digits.length === 10) return `${digits.slice(0, 8)}-${digits.slice(8, 9)}-${digits.slice(9)}`;
  return `${digits.slice(0, 8)}-${digits.slice(8, 9)}-${digits.slice(9, TAX_NUMBER_DIGITS)}`;
}

const BIRTH_COUNTRY_OTHER = "Egyéb";
const BIRTH_COUNTRY_OPTIONS = [
  { value: BIRTH_COUNTRY_OTHER, name: BIRTH_COUNTRY_OTHER },
  ...EUROPEAN_COUNTRIES,
];

const DOCUMENT_TYPE_OPTIONS = [
  { value: SIGNUP_DOCUMENT_TYPE_PASSPORT, name: SIGNUP_DOCUMENT_TYPE_PASSPORT },
  { value: SIGNUP_DOCUMENT_TYPE_ID_CARD, name: SIGNUP_DOCUMENT_TYPE_ID_CARD },
  { value: SIGNUP_DOCUMENT_TYPE_STUDENT_CARD, name: SIGNUP_DOCUMENT_TYPE_STUDENT_CARD },
];

const MAX_COMPANIONS = 5;

const MIN_BIRTH_DATE = "1950-01-01";
const getToday = () => new Date().toISOString().split("T")[0];
const getMaxBirthDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
};
const getMaxExpiryDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 30);
  return d.toISOString().split("T")[0];
};

export interface CompanionData {
  lastName: string;
  firstName: string;
  phone: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
}

export interface SignupFormData {
  wantInvoice: boolean;
  companyName: string;
  taxNumber: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
  companions: CompanionData[];
  notes: string;
}

const emptyCompanion = (): CompanionData => ({
  lastName: "",
  firstName: "",
  phone: "",
  birthCountry: DEFAULT_COUNTRY,
  birthPlace: "",
  birthDate: "",
  documentType: "",
  documentNumber: "",
  documentIssueDate: "",
  documentExpiryDate: "",
  allergies: "",
  fbLink: "",
});

const STEPS = [
  SIGNUP_STEP_BILLING,
  SIGNUP_STEP_TRAVEL,
  SIGNUP_STEP_COMPANIONS,
  SIGNUP_STEP_SUMMARY,
];

interface TourSignupDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: SignupFormData) => void;
  userProfile: UserProfile;
  eventTitle: string;
  startDate?: string;
  endDate?: string;
  price?: string;
}

export function TourSignupDialog({
  open,
  onClose,
  onComplete,
  userProfile,
  eventTitle,
  startDate,
  endDate,
  price,
}: TourSignupDialogProps) {
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [abortConfirmOpen, setAbortConfirmOpen] = useState(false);

  const [wantInvoice, setWantInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");

  const [birthCountry, setBirthCountry] = useState(DEFAULT_COUNTRY);
  const [birthCountryCustom, setBirthCountryCustom] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentIssueDate, setDocumentIssueDate] = useState("");
  const [documentExpiryDate, setDocumentExpiryDate] = useState("");
  const [allergies, setAllergies] = useState("");
  const [fbLink, setFbLink] = useState("");

  const [companions, setCompanions] = useState<CompanionData[]>([]);
  const [companionBirthCountryCustoms, setCompanionBirthCountryCustoms] = useState<string[]>([]);

  const [notes, setNotes] = useState("");
  const [accepted, setAccepted] = useState(false);

  function handleClose() {
    setStep(0);
    setStepErrors({});
    setWantInvoice(false);
    setCompanyName("");
    setTaxNumber("");
    setBirthCountry(DEFAULT_COUNTRY);
    setBirthCountryCustom("");
    setBirthPlace("");
    setBirthDate("");
    setDocumentType("");
    setDocumentNumber("");
    setDocumentIssueDate("");
    setDocumentExpiryDate("");
    setAllergies("");
    setFbLink("");
    setCompanions([]);
    setCompanionBirthCountryCustoms([]);
    setNotes("");
    setAccepted(false);
    onClose();
  }

  function validateStep1(): boolean {
    const errors: Record<string, string> = {};
    if (!userProfile.country) errors.billingCountry = SIGNUP_VALIDATION.missingAddress;
    if (!userProfile.city) errors.billingCity = SIGNUP_VALIDATION.missingAddress;
    if (!userProfile.zip) errors.billingZip = SIGNUP_VALIDATION.missingAddress;
    if (!userProfile.street) errors.billingStreet = SIGNUP_VALIDATION.missingAddress;
    if (!userProfile.houseNumber) errors.billingHouseNumber = SIGNUP_VALIDATION.missingAddress;
    if (wantInvoice && !companyName.trim()) {
      errors.companyName = SIGNUP_VALIDATION.required;
    } else if (wantInvoice && companyName.length > MAX_COMPANY_NAME) {
      errors.companyName = SIGNUP_VALIDATION.companyNameTooLong;
    }
    if (wantInvoice && !taxNumber) {
      errors.taxNumber = SIGNUP_VALIDATION.required;
    } else if (wantInvoice && taxNumber.length !== TAX_NUMBER_DIGITS) {
      errors.taxNumber = SIGNUP_VALIDATION.taxNumberInvalid;
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep2(): boolean {
    const errors: Record<string, string> = {};
    const today = getToday();
    const maxBirthDate = getMaxBirthDate();
    const maxExpiryDate = getMaxExpiryDate();

    if (birthCountry === BIRTH_COUNTRY_OTHER && !birthCountryCustom.trim()) {
      errors.birthCountryCustom = SIGNUP_VALIDATION.birthCountryRequired;
    }

    if (!birthPlace.trim()) {
      errors.birthPlace = SIGNUP_VALIDATION.required;
    } else if (birthPlace.trim().length < MIN_PLACE_NAME) {
      errors.birthPlace = SIGNUP_VALIDATION.birthPlaceTooShort;
    }

    if (!birthDate) {
      errors.birthDate = SIGNUP_VALIDATION.required;
    } else if (birthDate < MIN_BIRTH_DATE) {
      errors.birthDate = SIGNUP_VALIDATION.birthDateTooEarly;
    } else if (birthDate > maxBirthDate) {
      errors.birthDate = SIGNUP_VALIDATION.birthDateTooLate;
    }

    if (!documentType) errors.documentType = SIGNUP_VALIDATION.required;
    if (!documentNumber.trim()) {
      errors.documentNumber = SIGNUP_VALIDATION.required;
    } else if (documentNumber.trim().length < MIN_DOCUMENT_NUMBER) {
      errors.documentNumber = SIGNUP_VALIDATION.documentNumberTooShort;
    }

    if (!documentIssueDate) {
      errors.documentIssueDate = SIGNUP_VALIDATION.required;
    } else if (birthDate && (documentIssueDate < birthDate || documentIssueDate > today)) {
      errors.documentIssueDate = SIGNUP_VALIDATION.issueDateOutOfRange;
    }

    if (!documentExpiryDate) {
      errors.documentExpiryDate = SIGNUP_VALIDATION.required;
    } else if (documentIssueDate && documentExpiryDate <= documentIssueDate) {
      errors.documentExpiryDate = SIGNUP_VALIDATION.issueDateAfterExpiry;
    } else if (startDate && documentExpiryDate <= startDate) {
      errors.documentExpiryDate = SIGNUP_VALIDATION.expiryBeforeStartDate;
    } else if (documentExpiryDate > maxExpiryDate) {
      errors.documentExpiryDate = SIGNUP_VALIDATION.expiryDateOutOfRange;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep3(): boolean {
    const errors: Record<string, string> = {};
    const today = getToday();
    const maxBirthDate = getMaxBirthDate();
    const maxExpiryDate = getMaxExpiryDate();

    companions.forEach((c, idx) => {
      const p = `companion_${idx}_`;
      if (!c.lastName.trim()) errors[`${p}lastName`] = SIGNUP_VALIDATION.required;
      if (!c.firstName.trim()) errors[`${p}firstName`] = SIGNUP_VALIDATION.required;
      if (!c.phone.trim()) errors[`${p}phone`] = SIGNUP_VALIDATION.required;
      if (c.birthCountry === BIRTH_COUNTRY_OTHER && !companionBirthCountryCustoms[idx]?.trim()) {
        errors[`${p}birthCountryCustom`] = SIGNUP_VALIDATION.birthCountryRequired;
      }

      if (!c.birthPlace.trim()) {
        errors[`${p}birthPlace`] = SIGNUP_VALIDATION.required;
      } else if (c.birthPlace.trim().length < MIN_PLACE_NAME) {
        errors[`${p}birthPlace`] = SIGNUP_VALIDATION.birthPlaceTooShort;
      }

      if (!c.birthDate) {
        errors[`${p}birthDate`] = SIGNUP_VALIDATION.required;
      } else if (c.birthDate < MIN_BIRTH_DATE) {
        errors[`${p}birthDate`] = SIGNUP_VALIDATION.birthDateTooEarly;
      } else if (c.birthDate > maxBirthDate) {
        errors[`${p}birthDate`] = SIGNUP_VALIDATION.birthDateTooLate;
      }

      if (!c.documentType) errors[`${p}documentType`] = SIGNUP_VALIDATION.required;
      if (!c.documentNumber.trim()) {
        errors[`${p}documentNumber`] = SIGNUP_VALIDATION.required;
      } else if (c.documentNumber.trim().length < MIN_DOCUMENT_NUMBER) {
        errors[`${p}documentNumber`] = SIGNUP_VALIDATION.documentNumberTooShort;
      }

      if (!c.documentIssueDate) {
        errors[`${p}documentIssueDate`] = SIGNUP_VALIDATION.required;
      } else if (
        c.birthDate &&
        (c.documentIssueDate < c.birthDate || c.documentIssueDate > today)
      ) {
        errors[`${p}documentIssueDate`] = SIGNUP_VALIDATION.issueDateOutOfRange;
      }

      if (!c.documentExpiryDate) {
        errors[`${p}documentExpiryDate`] = SIGNUP_VALIDATION.required;
      } else if (c.documentIssueDate && c.documentExpiryDate <= c.documentIssueDate) {
        errors[`${p}documentExpiryDate`] = SIGNUP_VALIDATION.issueDateAfterExpiry;
      } else if (startDate && c.documentExpiryDate <= startDate) {
        errors[`${p}documentExpiryDate`] = SIGNUP_VALIDATION.expiryBeforeStartDate;
      } else if (c.documentExpiryDate > maxExpiryDate) {
        errors[`${p}documentExpiryDate`] = SIGNUP_VALIDATION.expiryDateOutOfRange;
      }
    });

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    let valid = true;
    if (step === 0) valid = validateStep1();
    if (step === 1) valid = validateStep2();
    if (step === 2) valid = validateStep3();
    if (valid) {
      setStepErrors({});
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStepErrors({});
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    if (!accepted) return;
    const resolvedBirthCountry =
      birthCountry === BIRTH_COUNTRY_OTHER ? birthCountryCustom : birthCountry;
    const resolvedCompanions = companions.map((c, idx) => ({
      ...c,
      birthCountry:
        c.birthCountry === BIRTH_COUNTRY_OTHER
          ? (companionBirthCountryCustoms[idx] ?? "")
          : c.birthCountry,
    }));
    onComplete({
      wantInvoice,
      companyName,
      taxNumber,
      birthCountry: resolvedBirthCountry,
      birthPlace,
      birthDate,
      documentType,
      documentNumber,
      documentIssueDate,
      documentExpiryDate,
      allergies,
      fbLink,
      companions: resolvedCompanions,
      notes,
    });
  }

  function updateCompanion(idx: number, field: keyof CompanionData, value: string) {
    setCompanions((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }

  function addCompanion() {
    if (companions.length < MAX_COMPANIONS) {
      setCompanions((prev) => [...prev, emptyCompanion()]);
      setCompanionBirthCountryCustoms((prev) => [...prev, ""]);
    }
  }

  function removeCompanion(idx: number) {
    setCompanions((prev) => prev.filter((_, i) => i !== idx));
    setCompanionBirthCountryCustoms((prev) => prev.filter((_, i) => i !== idx));
  }

  const numericPrice = price ? parseFloat(price.replace(/[^0-9.]/g, "")) : 0;
  const totalTravelers = 1 + companions.length;
  const totalPrice = numericPrice * totalTravelers;

  const isLastStep = step === STEPS.length - 1;

  const dialogActions = (
    <Box sx={{ display: "flex", gap: 1, width: "100%", p: 1 }}>
      {step === 0 ? (
        <CustomButton
          variant="outlined"
          color="inherit"
          sx={{ flex: 1 }}
          onClick={() => setAbortConfirmOpen(true)}
        >
          {SIGNUP_CLOSE_LABEL}
        </CustomButton>
      ) : (
        <CustomButton variant="outlined" color="inherit" sx={{ flex: 1 }} onClick={handleBack}>
          {SIGNUP_BACK_LABEL}
        </CustomButton>
      )}
      {isLastStep ? (
        <CustomButton
          variant="contained"
          color="primary"
          sx={{ flex: 1 }}
          disabled={!accepted}
          onClick={handleSubmit}
        >
          {SIGNUP_SUBMIT_LABEL}
        </CustomButton>
      ) : (
        <CustomButton variant="contained" color="primary" sx={{ flex: 1 }} onClick={handleNext}>
          {SIGNUP_NEXT_LABEL}
        </CustomButton>
      )}
    </Box>
  );

  return (
    <>
      <CustomDialog
        open={open}
        onClose={handleClose}
        title={`${SIGNUP_DIALOG_TITLE_PREFIX}: ${eventTitle}${startDate ? ` - ${formatDate(startDate)}` : ""}`}
        actions={dialogActions}
        contentDividers
        maxWidth="sm"
        fullWidth
      >
        <CustomStepper steps={STEPS} activeStep={step} sx={{ mb: 3 }} />

        {step === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CustomAlertMessage infoMessage={SIGNUP_BILLING_INFO} />
            <div className="signup-form__name-container">
              <CustomTextInput
                label={FORM_LABELS.lastName}
                value={userProfile.lastName ?? ""}
                disabled
              />
              <CustomTextInput
                label={FORM_LABELS.firstName}
                value={userProfile.firstName ?? ""}
                disabled
              />
            </div>
            <CustomTextInput label={FORM_LABELS.phone} value={userProfile.phone ?? ""} disabled />
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Cím
            </Typography>
            <CustomSelect
              id="billing-country"
              label={FORM_LABELS.country}
              value={userProfile.country ?? ""}
              disabled
              options={EUROPEAN_COUNTRIES}
              error={!!stepErrors.billingCountry}
              helperText={stepErrors.billingCountry}
            />
            <div className="signup-form__name-container">
              <CustomTextInput
                label={FORM_LABELS.city}
                value={userProfile.city ?? ""}
                disabled
                error={stepErrors.billingCity}
              />
              <CustomTextInput
                label={FORM_LABELS.zip}
                value={userProfile.zip ?? ""}
                disabled
                error={stepErrors.billingZip}
              />
            </div>
            <div className="signup-form__name-container">
              <CustomTextInput
                label={FORM_LABELS.street}
                value={userProfile.street ?? ""}
                disabled
                error={stepErrors.billingStreet}
              />
              <CustomTextInput
                label={FORM_LABELS.houseNumber}
                value={userProfile.houseNumber ?? ""}
                disabled
                error={stepErrors.billingHouseNumber}
              />
            </div>

            <Divider sx={{ my: 1 }} />

            <CustomCheckbox
              label={SIGNUP_BILLING_WANT_INVOICE}
              checked={wantInvoice}
              onChange={(e) => setWantInvoice((e.target as HTMLInputElement).checked)}
            />
            {wantInvoice && (
              <>
                <CustomTextInput
                  label={SIGNUP_BILLING_COMPANY_NAME}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={stepErrors.companyName}
                  required
                  slotProps={{ htmlInput: { maxLength: MAX_COMPANY_NAME } }}
                />
                <CustomTextInput
                  label={SIGNUP_BILLING_TAX_NUMBER}
                  value={formatTaxNumberDisplay(taxNumber)}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, TAX_NUMBER_DIGITS);
                    setTaxNumber(digits);
                  }}
                  error={stepErrors.taxNumber}
                  required
                  slotProps={{ htmlInput: { maxLength: TAX_NUMBER_DISPLAY_MAX } }}
                />
              </>
            )}
          </Box>
        )}

        {step === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CustomSelect
              id="birth-country"
              label={SIGNUP_TRAVEL_BIRTH_COUNTRY}
              value={birthCountry}
              onChange={(e) => {
                setBirthCountry(e.target.value as string);
                setBirthCountryCustom("");
              }}
              options={BIRTH_COUNTRY_OPTIONS}
              renderOption={(option) =>
                option.value === BIRTH_COUNTRY_OTHER ? <strong>{option.name}</strong> : option.name
              }
              required
            />
            {birthCountry === BIRTH_COUNTRY_OTHER && (
              <CustomTextInput
                label={SIGNUP_TRAVEL_BIRTH_COUNTRY}
                value={birthCountryCustom}
                onChange={(e) => setBirthCountryCustom(e.target.value)}
                error={stepErrors.birthCountryCustom}
                required
                slotProps={{ htmlInput: { maxLength: MAX_PLACE_NAME } }}
              />
            )}
            <CustomTextInput
              label={SIGNUP_TRAVEL_BIRTH_PLACE}
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              error={stepErrors.birthPlace}
              required
              slotProps={{ htmlInput: { maxLength: MAX_PLACE_NAME } }}
            />
            <CustomTextInput
              label={SIGNUP_TRAVEL_BIRTH_DATE}
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              error={stepErrors.birthDate}
              required
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: MIN_BIRTH_DATE, max: getMaxBirthDate() },
              }}
            />
            <CustomSelect
              id="document-type"
              label={SIGNUP_TRAVEL_DOCUMENT_TYPE}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as string)}
              options={DOCUMENT_TYPE_OPTIONS}
              error={!!stepErrors.documentType}
              helperText={stepErrors.documentType}
              required
            />
            <CustomTextInput
              label={SIGNUP_TRAVEL_DOCUMENT_NUMBER}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              error={stepErrors.documentNumber}
              required
              slotProps={{ htmlInput: { maxLength: MAX_DOCUMENT_NUMBER } }}
            />
            <div className="signup-form__name-container">
              <CustomTextInput
                label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
                type="date"
                value={documentIssueDate}
                onChange={(e) => setDocumentIssueDate(e.target.value)}
                error={stepErrors.documentIssueDate}
                required
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: birthDate || MIN_BIRTH_DATE, max: getToday() },
                }}
              />
              <CustomTextInput
                label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
                type="date"
                value={documentExpiryDate}
                onChange={(e) => setDocumentExpiryDate(e.target.value)}
                error={stepErrors.documentExpiryDate}
                required
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: [documentIssueDate, startDate].filter(Boolean).sort().at(-1) || undefined, max: getMaxExpiryDate() },
                }}
              />
            </div>
            <CustomTextInput
              label={SIGNUP_TRAVEL_ALLERGIES}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              multiline
              minRows={2}
              slotProps={{ htmlInput: { maxLength: MAX_ALLERGIES } }}
            />
            <CustomAlertMessage infoMessage={SIGNUP_TRAVEL_FB_INFO} />
            <CustomTextInput
              label={SIGNUP_TRAVEL_FB_LINK}
              value={fbLink}
              onChange={(e) => setFbLink(e.target.value)}
              slotProps={{ htmlInput: { maxLength: MAX_FB_LINK } }}
            />
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CustomAlertMessage infoMessage={SIGNUP_COMPANION_INFO} />

            {companions.map((companion, idx) => (
              <Box
                key={idx}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <strong>{SIGNUP_COMPANION_TITLE(idx + 1)}</strong>
                  <CustomButton
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => removeCompanion(idx)}
                  >
                    {SIGNUP_COMPANION_REMOVE}
                  </CustomButton>
                </Box>
                <div className="signup-form__name-container">
                  <CustomTextInput
                    label={FORM_LABELS.lastName}
                    value={companion.lastName}
                    onChange={(e) => updateCompanion(idx, "lastName", e.target.value)}
                    error={stepErrors[`companion_${idx}_lastName`]}
                    required
                    slotProps={{ htmlInput: { maxLength: MAX_NAME } }}
                  />
                  <CustomTextInput
                    label={FORM_LABELS.firstName}
                    value={companion.firstName}
                    onChange={(e) => updateCompanion(idx, "firstName", e.target.value)}
                    error={stepErrors[`companion_${idx}_firstName`]}
                    required
                    slotProps={{ htmlInput: { maxLength: MAX_NAME } }}
                  />
                </div>
                <CustomTextInput
                  label={FORM_LABELS.telephone}
                  value={companion.phone}
                  onChange={(e) => updateCompanion(idx, "phone", e.target.value)}
                  error={stepErrors[`companion_${idx}_phone`]}
                  required
                  slotProps={{ htmlInput: { maxLength: MAX_PHONE } }}
                />
                <CustomSelect
                  id={`companion-${idx}-birth-country`}
                  label={SIGNUP_TRAVEL_BIRTH_COUNTRY}
                  value={companion.birthCountry}
                  onChange={(e) => {
                    updateCompanion(idx, "birthCountry", e.target.value as string);
                    setCompanionBirthCountryCustoms((prev) => {
                      const next = [...prev];
                      next[idx] = "";
                      return next;
                    });
                  }}
                  options={BIRTH_COUNTRY_OPTIONS}
                  renderOption={(option) =>
                    option.value === BIRTH_COUNTRY_OTHER ? <strong>{option.name}</strong> : option.name
                  }
                  required
                />
                {companion.birthCountry === BIRTH_COUNTRY_OTHER && (
                  <CustomTextInput
                    label={SIGNUP_TRAVEL_BIRTH_COUNTRY}
                    value={companionBirthCountryCustoms[idx] ?? ""}
                    onChange={(e) =>
                      setCompanionBirthCountryCustoms((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })
                    }
                    error={stepErrors[`companion_${idx}_birthCountryCustom`]}
                    required
                    slotProps={{ htmlInput: { maxLength: MAX_PLACE_NAME } }}
                  />
                )}
                <CustomTextInput
                  label={SIGNUP_TRAVEL_BIRTH_PLACE}
                  value={companion.birthPlace}
                  onChange={(e) => updateCompanion(idx, "birthPlace", e.target.value)}
                  error={stepErrors[`companion_${idx}_birthPlace`]}
                  required
                  slotProps={{ htmlInput: { maxLength: MAX_PLACE_NAME } }}
                />
                <CustomTextInput
                  label={SIGNUP_TRAVEL_BIRTH_DATE}
                  type="date"
                  value={companion.birthDate}
                  onChange={(e) => updateCompanion(idx, "birthDate", e.target.value)}
                  error={stepErrors[`companion_${idx}_birthDate`]}
                  required
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: MIN_BIRTH_DATE, max: getMaxBirthDate() },
                  }}
                />
                <CustomSelect
                  id={`companion-${idx}-doc-type`}
                  label={SIGNUP_TRAVEL_DOCUMENT_TYPE}
                  value={companion.documentType}
                  onChange={(e) => updateCompanion(idx, "documentType", e.target.value as string)}
                  options={DOCUMENT_TYPE_OPTIONS}
                  error={!!stepErrors[`companion_${idx}_documentType`]}
                  helperText={stepErrors[`companion_${idx}_documentType`]}
                  required
                />
                <CustomTextInput
                  label={SIGNUP_TRAVEL_DOCUMENT_NUMBER}
                  value={companion.documentNumber}
                  onChange={(e) => updateCompanion(idx, "documentNumber", e.target.value)}
                  error={stepErrors[`companion_${idx}_documentNumber`]}
                  required
                  slotProps={{ htmlInput: { maxLength: MAX_DOCUMENT_NUMBER } }}
                />
                <div className="signup-form__name-container">
                  <CustomTextInput
                    label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
                    type="date"
                    value={companion.documentIssueDate}
                    onChange={(e) => updateCompanion(idx, "documentIssueDate", e.target.value)}
                    error={stepErrors[`companion_${idx}_documentIssueDate`]}
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <CustomTextInput
                    label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
                    type="date"
                    value={companion.documentExpiryDate}
                    onChange={(e) => updateCompanion(idx, "documentExpiryDate", e.target.value)}
                    error={stepErrors[`companion_${idx}_documentExpiryDate`]}
                    required
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: [companion.documentIssueDate, startDate].filter(Boolean).sort().at(-1) || undefined, max: getMaxExpiryDate() } }}
                  />
                </div>
                <CustomTextInput
                  label={SIGNUP_TRAVEL_ALLERGIES}
                  value={companion.allergies}
                  onChange={(e) => updateCompanion(idx, "allergies", e.target.value)}
                  multiline
                  minRows={2}
                  slotProps={{ htmlInput: { maxLength: MAX_ALLERGIES } }}
                />
                <CustomTextInput
                  label={SIGNUP_TRAVEL_FB_LINK}
                  value={companion.fbLink}
                  onChange={(e) => updateCompanion(idx, "fbLink", e.target.value)}
                  slotProps={{ htmlInput: { maxLength: MAX_FB_LINK } }}
                />
              </Box>
            ))}

            {companions.length < MAX_COMPANIONS && (
              <CustomButton variant="outlined" onClick={addCompanion}>
                {SIGNUP_COMPANION_ADD_BUTTON}
              </CustomButton>
            )}

            <CustomAlertMessage infoMessage={SIGNUP_COMPANION_MAX_INFO} />
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="tour-signup-summary">
              <div className="grid grid-cols-2 gap-3">
                <span className="font-semibold">{SIGNUP_SUMMARY_TRAVELERS}:</span>
                <span>{totalTravelers} {SIGNUP_SUMMARY_TRAVELER_UNIT}</span>

                <span className="font-semibold">{SIGNUP_SUMMARY_TRAVELER_NAMES}:</span>
                <span>
                  {[
                    `${userProfile.lastName ?? ""} ${userProfile.firstName ?? ""}`.trim(),
                    ...companions.map((c) => `${c.lastName} ${c.firstName}`.trim()),
                  ].join(", ")}
                </span>

                {(startDate || endDate) && (
                  <>
                    <span className="font-semibold">{SIGNUP_SUMMARY_SCHEDULE}:</span>
                    <span>
                      {startDate ? formatDate(startDate) : ""}
                      {endDate ? ` – ${formatDate(endDate)}` : ""}
                    </span>
                  </>
                )}

                {numericPrice > 0 && (
                  <>
                    <span className="font-semibold">{SIGNUP_SUMMARY_TOTAL_PRICE}:</span>
                    <span>
                      {totalPrice.toLocaleString("hu-HU")} {CURRENCY}
                      <Typography
                        sx={{ fontSize: "1.5rem", color: colors.label.green }}
                        component="span"
                      >
                        ({totalTravelers} × {numericPrice.toLocaleString("hu-HU")} {CURRENCY})
                      </Typography>
                    </span>
                  </>
                )}
              </div>
            </div>

            <CustomTextInput
              label={SIGNUP_SUMMARY_NOTES}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              minRows={3}
              slotProps={{ htmlInput: { maxLength: MAX_NOTES } }}
            />

            <Divider sx={{ my: 1 }} />

            <CustomAlertMessage infoMessage={SIGNUP_TOUR_INFO_IN_PROFILE} />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <CustomButton
                variant="outlined"
                size="small"
                onClick={() => window.open("/aszf", "_blank")}
              >
                {SIGNUP_ASZF_BUTTON_LABEL}
              </CustomButton>
              <CustomButton
                variant="outlined"
                size="small"
                onClick={() => window.open("/adatvedelem", "_blank")}
              >
                {SIGNUP_PRIVACY_BUTTON_LABEL}
              </CustomButton>
            </Box>

            <CustomCheckbox
              checked={accepted}
              onChange={(e) => setAccepted((e.target as HTMLInputElement).checked)}
              label={SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL}
              error={!accepted}
            />
          </Box>
        )}
      </CustomDialog>

      <CustomConfirmDialog
        open={abortConfirmOpen}
        title={SIGNUP_ABORT_CONFIRM_TITLE}
        content={SIGNUP_ABORT_CONFIRM_CONTENT}
        cancelLabel={SIGNUP_ABORT_CONFIRM_CANCEL}
        confirmLabel={SIGNUP_ABORT_CONFIRM_PROCEED}
        onCancel={() => setAbortConfirmOpen(false)}
        onConfirm={() => {
          setAbortConfirmOpen(false);
          handleClose();
        }}
      />
    </>
  );
}
