"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import {
  LOADING_LABEL,
  AUTH_BACK_TO_LOGIN,
  AUTH_FORGOT_PASSWORD_TITLE,
  FORM_LABELS,
} from "@/utils/texts";
import { useFormStatus } from "react-dom";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
  successMessage: null,
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <CustomButton type="submit" variant="contained" color="primary" size="large" disabled={pending}>
      {pending ? LOADING_LABEL : AUTH_FORGOT_PASSWORD_TITLE}
    </CustomButton>
  );
}

function ForgotPasswordFormInner() {
  const [formState, formAction] = useActionState(forgotPasswordAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "forgot_password");

  return (
    <>
      {formState?.successMessage ? (
        <CustomAlertMessage successMessage={formState.successMessage} />
      ) : (
        <form ref={formRef} className="auth-page__form" onSubmit={handleSubmit}>
          <CustomTextInput
            id="email"
            label={FORM_LABELS.email}
            name="email"
            type="email"
            error={formState?.zodErrors?.email?.[0]}
          />
          <CustomAlertMessage errorMessage={formState?.errorMessage} />
          <div className="auth-page__buttons">
            <SubmitBtn />
          </div>
        </form>
      )}
      <p className="auth-page__forgot-link">
        <Link href="/login">{AUTH_BACK_TO_LOGIN}</Link>
      </p>
    </>
  );
}

export function ForgotPasswordForm() {
  return (
    <RecaptchaProvider>
      <ForgotPasswordFormInner />
    </RecaptchaProvider>
  );
}
