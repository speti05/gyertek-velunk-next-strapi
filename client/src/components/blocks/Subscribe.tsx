"use client";
import type { SubscribeProps } from "@/types";
import { useActionState, useRef, useState } from "react";
import { subscribeAction } from "@/data/actions";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { getStrapiMediaURL } from "@/utils/get-strapi-url";
import { MAX_EMAIL } from "@/components/custom-ui-components/custom-text-input/input-length-limits";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import { useFlashMessage } from "@/hooks/use-flash-message";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
  image,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(subscribeAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "newsletter_subscribe");

  const displayedSuccess = useFlashMessage(formState);
  const [inputKey, setInputKey] = useState(0);
  const [handledState, setHandledState] = useState(formState);

  // Reacting to a new action result during render avoids the extra render pass a setState-in-effect causes
  if (formState !== handledState) {
    setHandledState(formState);
    if (formState?.successMessage) setInputKey((k) => k + 1);
  }

  const zodErrors = formState?.zodErrors?.email;
  const errorMessage = zodErrors || formState?.errorMessage;

  const imageUrl = `${getStrapiMediaURL()}${image?.url}`;

  return (
    <section className="newsletter" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="newsletter__backdrop" />
      <div className="newsletter__inner">
        <div className="newsletter__info">
          <h4>{headline}</h4>
          <p className="copy">{content}</p>
        </div>
        <div className="newsletter__form-wrap">
          <form className="newsletter__form" ref={formRef} onSubmit={handleSubmit}>
            <CustomTextInput key={inputKey} name="email" type="text" placeholder={placeholder} slotProps={{ htmlInput: { maxLength: MAX_EMAIL } }} />
            {(displayedSuccess || errorMessage) && (
              <div style={{ marginBottom: "3rem" }}>
                <CustomAlertMessage successMessage={displayedSuccess} errorMessage={errorMessage} />
              </div>
            )}
            <CustomButton type="submit" variant="contained" size="large">
              {buttonText}
            </CustomButton>
          </form>
        </div>
      </div>
    </section>
  );
}
