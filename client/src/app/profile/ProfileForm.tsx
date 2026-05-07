"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { SubmitButton } from "@/components/SubmitButton";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import {
  FORM_LABELS,
  AUTH_SAVE_LABEL,
  PROFILE_BASIC_DATA_SECTION,
} from "@/utils/texts";

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
}

export function ProfileForm({ email, firstName, lastName, phone }: ProfileFormProps) {
  const [formState, formAction] = useActionState(updateProfileAction, INITIAL_STATE);
  const zodErrors = formState?.zodErrors as Record<string, string[]> | null;

  const toStr = (v: string | null) => v ?? "";

  const [values, setValues] = useState({
    firstName: toStr(firstName),
    lastName: toStr(lastName),
    phone: toStr(phone),
  });

  // Tracks what's currently saved in Strapi — updated when props change after re-render
  const [savedValues, setSavedValues] = useState({
    firstName: toStr(firstName),
    lastName: toStr(lastName),
    phone: toStr(phone),
  });

  // When the parent re-renders with fresh Strapi data (after successful save), sync state
  useEffect(() => {
    const fresh = {
      firstName: toStr(firstName),
      lastName: toStr(lastName),
      phone: toStr(phone),
    };
    setValues(fresh);
    setSavedValues(fresh);
  }, [firstName, lastName, phone]);

  const hasChanges =
    values.firstName !== savedValues.firstName ||
    values.lastName !== savedValues.lastName ||
    values.phone !== savedValues.phone;

  return (
    <section className="auth-page__section">
      <h2 className="auth-page__section-title">{PROFILE_BASIC_DATA_SECTION}</h2>
      <form action={formAction} className="auth-page__form">
        <CustomTextInput
          id="email"
          label={FORM_LABELS.email}
          name="email"
          type="email"
          value={email}
          disabled
        />
        <div className="signup-form__name-container">
          <CustomTextInput
            id="lastName"
            label={FORM_LABELS.lastName}
            name="lastName"
            error={zodErrors?.lastName?.[0]}
            value={values.lastName}
            onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))}
          />
          <CustomTextInput
            id="firstName"
            label={FORM_LABELS.firstName}
            name="firstName"
            error={zodErrors?.firstName?.[0]}
            value={values.firstName}
            onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
          />
        </div>
        <CustomTextInput
          id="phone"
          label={FORM_LABELS.phone}
          name="phone"
          type="text"
          error={zodErrors?.phone?.[0]}
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
        />
        <SubmitButton text={AUTH_SAVE_LABEL} disabled={!hasChanges} />
        <CustomAlertMessage
          errorMessage={formState?.errorMessage}
          successMessage={formState?.successMessage}
        />
      </form>
    </section>
  );
}
