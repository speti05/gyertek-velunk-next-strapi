"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { authAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import {
  LOADING_LABEL,
  AUTH_LOGIN_LABEL,
  AUTH_REGISTER_LABEL,
  AUTH_DIVIDER_LABEL,
  AUTH_PASSWORD_LABEL,
  AUTH_CONFIRM_PASSWORD_LABEL,
  AUTH_BACK_TO_LOGIN,
  AUTH_HAS_ACCOUNT_HINT,
  PASSWORD_RULES,
  FORM_LABELS,
  AUTH_TERMS_ACCEPT_PREFIX,
  AUTH_TERMS_LINK_LABEL,
  AUTH_TERMS_ACCEPT_SUFFIX,
  AUTH_TERMS_REQUIRED_ERROR,
} from "@/utils/texts";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import { MAX_EMAIL, MAX_PASSWORD } from "@/components/custom-ui-components/custom-text-input/input-length-limits";
import { CustomCheckbox } from "@/components/custom-ui-components/custom-checkbox/custom-checkbox";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
  successMessage: null,
};

function PasswordStrengthHint({ password }: { password: string }) {
  return (
    <ul className="auth-page__password-rules no-list-style">
      {PASSWORD_RULES.map((rule) => (
        <li
          key={rule.label}
          className={`auth-page__password-rule${rule.test(password) ? " auth-page__password-rule--met" : ""}`}
        >
          <CustomIcon name={rule.test(password) ? "checked" : "unchecked"}></CustomIcon>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <div className="auth-page__buttons">
      <CustomButton
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        disabled={pending}
      >
        {pending ? LOADING_LABEL : AUTH_REGISTER_LABEL}
      </CustomButton>
    </div>
  );
}

function RegisterFormInner() {
  const [formState, formAction] = useActionState(authAction, INITIAL_STATE);
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const baseAction = useRecaptchaSubmit(formRef, formAction, "auth");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!termsAccepted) {
      e.preventDefault();
      setTermsError(true);
      return;
    }
    setTermsError(false);
    baseAction(e);
  }

  if (formState?.successMessage) {
    return (
      <>
        <h1 className="auth-page__title auth-page__title--register">{AUTH_REGISTER_LABEL}</h1>
        <CustomAlertMessage successMessage={formState.successMessage} />
        <p className="auth-page__forgot-link">
          <CustomLink href="/login" color="secondary">{AUTH_BACK_TO_LOGIN}</CustomLink>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="auth-page__title auth-page__title--register">{AUTH_REGISTER_LABEL}</h1>
      <form ref={formRef} className="auth-page__form" onSubmit={handleSubmit}>
        <input type="hidden" name="mode" defaultValue="register" />
        <CustomTextInput
          id="email"
          label={FORM_LABELS.email}
          name="email"
          type="email"
          error={formState?.zodErrors?.email?.[0]}
          slotProps={{ htmlInput: { maxLength: MAX_EMAIL } }}
        />
        <CustomTextInput
          id="password"
          label={AUTH_PASSWORD_LABEL}
          name="password"
          type="password"
          error={formState?.zodErrors?.password?.[0]}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          slotProps={{ htmlInput: { maxLength: MAX_PASSWORD } }}
        />
        <PasswordStrengthHint password={password} />
        <CustomTextInput
          id="passwordConfirmation"
          label={AUTH_CONFIRM_PASSWORD_LABEL}
          name="passwordConfirmation"
          type="password"
          error={formState?.zodErrors?.passwordConfirmation?.[0]}
          slotProps={{ htmlInput: { maxLength: MAX_PASSWORD } }}
        />
        <CustomAlertMessage errorMessage={formState?.errorMessage} />
        <CustomCheckbox
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
            if (e.target.checked) setTermsError(false);
          }}
          error={termsError}
          helperText={termsError ? AUTH_TERMS_REQUIRED_ERROR : undefined}
          label={
            <span>
              {AUTH_TERMS_ACCEPT_PREFIX}
              <CustomLink
                href="/felhasznalasi-feltetelek"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                {AUTH_TERMS_LINK_LABEL}
              </CustomLink>
              {AUTH_TERMS_ACCEPT_SUFFIX}
            </span>
          }
        />
        <SubmitBtn />
        <div className="auth-page__divider">{AUTH_DIVIDER_LABEL}</div>
        <p className="auth-page__hint">
          {AUTH_HAS_ACCOUNT_HINT}{" "}
          <CustomLink href="/login" color="primary">
            {AUTH_LOGIN_LABEL}
          </CustomLink>
        </p>
      </form>
    </>
  );
}

export function RegisterForm() {
  return <RegisterFormInner />;
}
