"use client";
import type { SubscribeProps } from "@/types";
import { useActionState, useEffect, useRef, useState } from "react";
import { subscribeAction } from "@/data/actions";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { getStrapiURL } from "@/utils/get-strapi-url";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";

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

  const [inputKey, setInputKey] = useState(0);
  const [displayedSuccess, setDisplayedSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!formState?.successMessage) return;
    setInputKey((k) => k + 1);
    setDisplayedSuccess(formState.successMessage);
    const t = setTimeout(() => setDisplayedSuccess(null), 5000);
    return () => clearTimeout(t);
  }, [formState?.successMessage]);

  const zodErrors = formState?.zodErrors?.email;
  const errorMessage = zodErrors || formState?.errorMessage;

  const imageUrl = `${getStrapiURL()}${image?.url}`;

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
            <CustomTextInput key={inputKey} name="email" type="text" placeholder={placeholder} />
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
