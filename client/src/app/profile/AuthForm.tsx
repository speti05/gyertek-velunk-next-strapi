"use client";

import { useActionState, useRef } from "react";
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
  AUTH_FORGOT_PASSWORD_LABEL,
  AUTH_NO_ACCOUNT_HINT,
  FORM_LABELS,
} from "@/utils/texts";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <div className="auth-page__buttons">
      <CustomButton
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={pending}
      >
        {pending ? LOADING_LABEL : AUTH_LOGIN_LABEL}
      </CustomButton>
    </div>
  );
}

function AuthFormInner() {
  const [formState, formAction] = useActionState(authAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "auth");

  return (
    <>
      <h1 className="auth-page__title">{AUTH_LOGIN_LABEL}</h1>
      <form ref={formRef} className="auth-page__form" onSubmit={handleSubmit}>
        <input type="hidden" name="mode" defaultValue="login" />
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
        />
        <CustomAlertMessage errorMessage={formState?.errorMessage} />
        <SubmitBtn />
        <div className="auth-page__divider">{AUTH_DIVIDER_LABEL}</div>
        <p className="auth-page__hint">
          {AUTH_NO_ACCOUNT_HINT}{" "}
          <Link href="/register" className="auth-page__link">
            {AUTH_REGISTER_LABEL}
          </Link>
        </p>
        <p className="auth-page__forgot-link">
          <Link href="/forgot-password">{AUTH_FORGOT_PASSWORD_LABEL}</Link>
        </p>
      </form>
    </>
  );
}

export function AuthForm() {
  return (
    <RecaptchaProvider>
      <AuthFormInner />
    </RecaptchaProvider>
  );
}
