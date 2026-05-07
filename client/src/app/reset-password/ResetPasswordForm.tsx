"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/data/auth-actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import {
  LOADING_LABEL,
  AUTH_SAVE_LABEL,
  AUTH_NEW_PASSWORD_LABEL,
  AUTH_CONFIRM_PASSWORD_LABEL,
} from "@/utils/texts";

const INITIAL_STATE = {
  zodErrors: null,
  errorMessage: null,
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <CustomButton type="submit" variant="contained" color="primary" size="large" disabled={pending}>
      {pending ? LOADING_LABEL : AUTH_SAVE_LABEL}
    </CustomButton>
  );
}

function ResetPasswordFormInner({ code }: { code: string }) {
  const [formState, formAction] = useActionState(resetPasswordAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "reset_password");

  return (
    <form ref={formRef} className="auth-page__form" onSubmit={handleSubmit}>
      <input type="hidden" name="code" value={code} />
      <CustomTextInput
        id="password"
        label={AUTH_NEW_PASSWORD_LABEL}
        name="password"
        type="password"
        error={formState?.zodErrors?.password?.[0]}
      />
      <CustomTextInput
        id="passwordConfirmation"
        label={AUTH_CONFIRM_PASSWORD_LABEL}
        name="passwordConfirmation"
        type="password"
        error={formState?.zodErrors?.passwordConfirmation?.[0]}
      />
      <CustomAlertMessage errorMessage={formState?.errorMessage} />
      <div className="auth-page__buttons">
        <SubmitBtn />
      </div>
    </form>
  );
}

export function ResetPasswordForm({ code }: { code: string }) {
  return (
    <RecaptchaProvider>
      <ResetPasswordFormInner code={code} />
    </RecaptchaProvider>
  );
}
