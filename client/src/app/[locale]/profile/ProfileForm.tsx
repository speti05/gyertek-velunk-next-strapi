"use client";

import { useLocale, useTexts } from "@/context/locale-context";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomSelect } from "@/components/custom-ui-components/custom-select/custom-select";
import { SubmitButtonNoSSR } from "@/components/SubmitButtonNoSSR";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { getEuropeanCountries, DEFAULT_COUNTRY } from "@/utils/european-countries";
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
}: ProfileFormProps) {
  const { FORM_LABELS, AUTH_SAVE_LABEL, PROFILE_BASIC_DATA_SECTION, PROFILE_ADDRESS_SECTION, PROFILE_INCOMPLETE_WARNING, PROFILE_BASIC_DATA_READONLY_INFO } = useTexts();
  const countryOptions = getEuropeanCountries(useLocale());
  const [formState, formAction] = useActionState(updateProfileAction, INITIAL_STATE);
  const zodErrors = formState?.zodErrors as Record<string, string[]> | null;

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!formState?.successMessage) return;
    setProfileSuccessMsg(formState.successMessage);
    const t = setTimeout(() => setProfileSuccessMsg(null), 5000);
    return () => clearTimeout(t);
  }, [formState?.successMessage]);

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
    <section className="profile-panel">
      <h2 className="profile-panel__title">{PROFILE_BASIC_DATA_SECTION}</h2>
      {isProfileIncomplete && <CustomAlertMessage warningMessage={PROFILE_INCOMPLETE_WARNING} />}

      {/* One form, two field groups: the save button at the bottom commits both the
          basic details and the address in a single submit. */}
      <form action={formAction} className="profile-form">
        <div className="profile-panel__group">
          <div className="profile-form__grid">
            <div className="profile-form__field--full">
              <CustomTextInput
                id="email"
                label={FORM_LABELS.email}
                name="email"
                type="email"
                value={email}
                disabled
              />
            </div>

            {isLastNameLocked && (
              <input type="hidden" name="lastName" value={savedValues.lastName} />
            )}
            {isFirstNameLocked && (
              <input type="hidden" name="firstName" value={savedValues.firstName} />
            )}
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

            {isPhoneLocked && <input type="hidden" name="phone" value={savedValues.phone} />}
            <CustomTextInput
              id="phone"
              label={FORM_LABELS.phone}
              name="phone"
              type="text"
              error={zodErrors?.phone?.[0]}
              value={values.phone}
              onChange={
                isPhoneLocked
                  ? undefined
                  : (e) => setValues((v) => ({ ...v, phone: e.target.value }))
              }
              slotProps={{ htmlInput: { maxLength: MAX_PHONE } }}
              disabled={isPhoneLocked}
            />
          </div>

          {areBasicDataLocked && (
            <CustomAlertMessage infoMessage={PROFILE_BASIC_DATA_READONLY_INFO} />
          )}
        </div>

        <div className="profile-panel__group">
          <h3 className="profile-panel__group-title">{PROFILE_ADDRESS_SECTION}</h3>

          <div className="profile-form__grid">
            <div className="profile-form__field--full">
              <CustomSelect
                id="country"
                name="country"
                label={FORM_LABELS.country}
                value={values.country}
                onChange={(e) => setValues((v) => ({ ...v, country: e.target.value as string }))}
                options={countryOptions}
                error={!!zodErrors?.country?.[0]}
                helperText={zodErrors?.country?.[0]}
                required
              />
            </div>
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
        </div>

        <CustomAlertMessage
          errorMessage={formState?.errorMessage}
          successMessage={profileSuccessMsg}
        />

        <div className="profile-panel__footer">
          <SubmitButtonNoSSR text={AUTH_SAVE_LABEL} disabled={!hasChanges} />
        </div>
      </form>
    </section>
  );
}
