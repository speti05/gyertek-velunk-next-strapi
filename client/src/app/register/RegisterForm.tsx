"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { authAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import Link from "next/link";
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
} from "@/utils/texts";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
  successMessage: null,
};

function PasswordStrengthHint({ password }: { password: string }) {
  return (
    <ul className="auth-page__password-rules">
      {PASSWORD_RULES.map((rule) => (
        <li
          key={rule.label}
          className={`auth-page__password-rule${rule.test(password) ? " auth-page__password-rule--met" : ""}`}
        >
          <span>{rule.test(password) ? "✓" : "○"}</span>
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
      <CustomButton type="submit" variant="contained" color="secondary" size="large" disabled={pending}>
        {pending ? LOADING_LABEL : AUTH_REGISTER_LABEL}
      </CustomButton>
    </div>
  );
}

function RegisterFormInner() {
  const [formState, formAction] = useActionState(authAction, INITIAL_STATE);
  const [password, setPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "auth");

  if (formState?.successMessage) {
    return (
      <>
        <h1 className="auth-page__title auth-page__title--register">{AUTH_REGISTER_LABEL}</h1>
        <CustomAlertMessage successMessage={formState.successMessage} />
        <p className="auth-page__forgot-link">
          <Link href="/login">{AUTH_BACK_TO_LOGIN}</Link>
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
        />
        <CustomTextInput
          id="password"
          label={AUTH_PASSWORD_LABEL}
          name="password"
          type="password"
          error={formState?.zodErrors?.password?.[0]}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        <PasswordStrengthHint password={password} />
        <CustomTextInput
          id="passwordConfirmation"
          label={AUTH_CONFIRM_PASSWORD_LABEL}
          name="passwordConfirmation"
          type="password"
          error={formState?.zodErrors?.passwordConfirmation?.[0]}
        />
        <CustomAlertMessage errorMessage={formState?.errorMessage} />
        <SubmitBtn />
        <div className="auth-page__divider">{AUTH_DIVIDER_LABEL}</div>
        <p className="auth-page__hint">
          {AUTH_HAS_ACCOUNT_HINT}{" "}
          <Link href="/login" className="auth-page__link">
            {AUTH_LOGIN_LABEL}
          </Link>
        </p>
      </form>
    </>
  );
}

export function RegisterForm() {
  return (
    <RecaptchaProvider>
      <RegisterFormInner />
    </RecaptchaProvider>
  );
}
