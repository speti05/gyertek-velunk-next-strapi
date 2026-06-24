"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateProfileAction, toggleNewsletterSubscriptionAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomCheckbox } from "@/components/custom-ui-components/custom-checkbox/custom-checkbox";
import { CustomSelect } from "@/components/custom-ui-components/custom-select/custom-select";
import { SubmitButtonNoSSR } from "@/components/SubmitButtonNoSSR";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import {
  FORM_LABELS,
  AUTH_SAVE_LABEL,
  PROFILE_BASIC_DATA_SECTION,
  PROFILE_ADDRESS_SECTION,
  PROFILE_INCOMPLETE_WARNING,
  PROFILE_BASIC_DATA_READONLY_INFO,
  PROFILE_NEWSLETTER_SECTION,
  PROFILE_NEWSLETTER_SUBSCRIBE_LABEL,
} from "@/utils/texts";
import { EUROPEAN_COUNTRIES, DEFAULT_COUNTRY } from "@/utils/european-countries";
import {
  MAX_NAME,
  MAX_PHONE,
  MAX_PLACE_NAME,
  MAX_ZIP,
  MAX_STREET,
  MAX_HOUSE_NUMBER,
} from "@/components/custom-ui-components/custom-text-input/input-length-limits";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
  successMessage: null,
};

interface ProfileFormProps {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  zip: string | null;
  street: string | null;
  houseNumber: string | null;
  isNewsletterSubscribed: boolean;
}

export function ProfileForm({
  email,
  firstName,
  lastName,
  phone,
  country,
  city,
  zip,
  street,
  houseNumber,
  isNewsletterSubscribed,
}: ProfileFormProps) {
  const [formState, formAction] = useActionState(updateProfileAction, INITIAL_STATE);
  const [newsletterState, newsletterAction] = useActionState(toggleNewsletterSubscriptionAction, {
    subscribed: isNewsletterSubscribed,
    errorMessage: null,
    successMessage: null,
  });
  const newsletterFormRef = useRef<HTMLFormElement>(null);
  const zodErrors = formState?.zodErrors as Record<string, string[]> | null;

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [newsletterSuccessMsg, setNewsletterSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!formState?.successMessage) return;
    setProfileSuccessMsg(formState.successMessage);
    const t = setTimeout(() => setProfileSuccessMsg(null), 5000);
    return () => clearTimeout(t);
  }, [formState?.successMessage]);

  useEffect(() => {
    if (!newsletterState?.successMessage) return;
    setNewsletterSuccessMsg(newsletterState.successMessage);
    const t = setTimeout(() => setNewsletterSuccessMsg(null), 5000);
    return () => clearTimeout(t);
  }, [newsletterState?.successMessage]);

  const toStr = (v: string | null) => v ?? "";

  const [values, setValues] = useState({
    firstName: toStr(firstName),
    lastName: toStr(lastName),
    phone: toStr(phone),
    country: toStr(country) || DEFAULT_COUNTRY,
    city: toStr(city),
    zip: toStr(zip),
    street: toStr(street),
    houseNumber: toStr(houseNumber),
  });

  const [savedValues, setSavedValues] = useState({
    firstName: toStr(firstName),
    lastName: toStr(lastName),
    phone: toStr(phone),
    country: toStr(country) || DEFAULT_COUNTRY,
    city: toStr(city),
    zip: toStr(zip),
    street: toStr(street),
    houseNumber: toStr(houseNumber),
  });

  useEffect(() => {
    const fresh = {
      firstName: toStr(firstName),
      lastName: toStr(lastName),
      phone: toStr(phone),
      country: toStr(country) || DEFAULT_COUNTRY,
      city: toStr(city),
      zip: toStr(zip),
      street: toStr(street),
      houseNumber: toStr(houseNumber),
    };
    setValues(fresh);
    setSavedValues(fresh);
  }, [firstName, lastName, phone, country, city, zip, street, houseNumber]);

  const hasChanges =
    values.firstName !== savedValues.firstName ||
    values.lastName !== savedValues.lastName ||
    values.phone !== savedValues.phone ||
    values.country !== savedValues.country ||
    values.city !== savedValues.city ||
    values.zip !== savedValues.zip ||
    values.street !== savedValues.street ||
    values.houseNumber !== savedValues.houseNumber;

  const isProfileIncomplete =
    !savedValues.firstName ||
    !savedValues.lastName ||
    !savedValues.phone ||
    !savedValues.country ||
    !savedValues.city ||
    !savedValues.zip ||
    !savedValues.street ||
    !savedValues.houseNumber;

  const isFirstNameLocked = !!savedValues.firstName;
  const isLastNameLocked = !!savedValues.lastName;
  const isPhoneLocked = !!savedValues.phone;
  const areBasicDataLocked = isFirstNameLocked && isLastNameLocked && isPhoneLocked;

  return (
    <>
      <section className="auth-page__section">
        <h2 className="auth-page__section-title">{PROFILE_BASIC_DATA_SECTION}</h2>
        {isProfileIncomplete && <CustomAlertMessage warningMessage={PROFILE_INCOMPLETE_WARNING} />}
        <form action={formAction} className="auth-page__form">
          <CustomTextInput
            id="email"
            label={FORM_LABELS.email}
            name="email"
            type="email"
            value={email}
            disabled
          />
          {isLastNameLocked && <input type="hidden" name="lastName" value={savedValues.lastName} />}
          {isFirstNameLocked && (
            <input type="hidden" name="firstName" value={savedValues.firstName} />
          )}
          <div className="signup-form__name-container">
            <CustomTextInput
              id="lastName"
              label={FORM_LABELS.lastName}
              name="lastName"
              error={zodErrors?.lastName?.[0]}
              value={values.lastName}
              onChange={
                isLastNameLocked
                  ? undefined
                  : (e) => setValues((v) => ({ ...v, lastName: e.target.value }))
              }
              slotProps={{ htmlInput: { maxLength: MAX_NAME } }}
              disabled={isLastNameLocked}
            />
            <CustomTextInput
              id="firstName"
              label={FORM_LABELS.firstName}
              name="firstName"
              error={zodErrors?.firstName?.[0]}
              value={values.firstName}
              onChange={
                isFirstNameLocked
                  ? undefined
                  : (e) => setValues((v) => ({ ...v, firstName: e.target.value }))
              }
              slotProps={{ htmlInput: { maxLength: MAX_NAME } }}
              disabled={isFirstNameLocked}
            />
          </div>
          {isPhoneLocked && <input type="hidden" name="phone" value={savedValues.phone} />}
          <CustomTextInput
            id="phone"
            label={FORM_LABELS.phone}
            name="phone"
            type="text"
            error={zodErrors?.phone?.[0]}
            value={values.phone}
            onChange={
              isPhoneLocked ? undefined : (e) => setValues((v) => ({ ...v, phone: e.target.value }))
            }
            slotProps={{ htmlInput: { maxLength: MAX_PHONE } }}
            disabled={isPhoneLocked}
          />

          {areBasicDataLocked && (
            <CustomAlertMessage infoMessage={PROFILE_BASIC_DATA_READONLY_INFO} />
          )}

          <h3 className="auth-page__subsection-title">{PROFILE_ADDRESS_SECTION}</h3>

          <CustomSelect
            id="country"
            name="country"
            label={FORM_LABELS.country}
            value={values.country}
            onChange={(e) => setValues((v) => ({ ...v, country: e.target.value as string }))}
            options={EUROPEAN_COUNTRIES}
            error={!!zodErrors?.country?.[0]}
            helperText={zodErrors?.country?.[0]}
            required
          />
          <div className="auth-page__address-row">
            <CustomTextInput
              id="city"
              label={FORM_LABELS.city}
              name="city"
              error={zodErrors?.city?.[0]}
              value={values.city}
              onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
              slotProps={{ htmlInput: { maxLength: MAX_PLACE_NAME } }}
            />
            <CustomTextInput
              id="zip"
              label={FORM_LABELS.zip}
              name="zip"
              error={zodErrors?.zip?.[0]}
              value={values.zip}
              onChange={(e) => setValues((v) => ({ ...v, zip: e.target.value }))}
              slotProps={{ htmlInput: { maxLength: MAX_ZIP } }}
            />
          </div>
          <div className="auth-page__address-row">
            <CustomTextInput
              id="street"
              label={FORM_LABELS.street}
              name="street"
              error={zodErrors?.street?.[0]}
              value={values.street}
              onChange={(e) => setValues((v) => ({ ...v, street: e.target.value }))}
              slotProps={{ htmlInput: { maxLength: MAX_STREET } }}
            />
            <CustomTextInput
              id="houseNumber"
              label={FORM_LABELS.houseNumber}
              name="houseNumber"
              error={zodErrors?.houseNumber?.[0]}
              value={values.houseNumber}
              onChange={(e) => setValues((v) => ({ ...v, houseNumber: e.target.value }))}
              slotProps={{ htmlInput: { maxLength: MAX_HOUSE_NUMBER } }}
            />
          </div>

          <SubmitButtonNoSSR text={AUTH_SAVE_LABEL} disabled={!hasChanges} />
          <CustomAlertMessage
            errorMessage={formState?.errorMessage}
            successMessage={profileSuccessMsg}
          />
        </form>
      </section>
      <section className="auth-page__section">
        <h2 className="auth-page__section-title">{PROFILE_NEWSLETTER_SECTION}</h2>
        <form
          action={newsletterAction}
          ref={newsletterFormRef}
          className="auth-page__newsletter-form"
        >
          <input
            type="hidden"
            name="subscribe"
            value={newsletterState.subscribed ? "false" : "true"}
          />
          <CustomCheckbox
            label={PROFILE_NEWSLETTER_SUBSCRIBE_LABEL}
            checked={newsletterState.subscribed}
            size="large"
            onChange={() => newsletterFormRef.current?.requestSubmit()}
          />
          <CustomAlertMessage
            errorMessage={newsletterState.errorMessage}
            successMessage={newsletterSuccessMsg}
          />
        </form>
      </section>
    </>
  );
}
