"use client";
import type { SubscribeProps } from "@/types";
import { useActionState } from "react";
import { subscribeAction } from "@/data/actions";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";

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
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(
    subscribeAction,
    INITIAL_STATE
  );
;
  const zodErrors = formState?.zodErrors?.email;
  const strapiErrors = formState?.strapiErrors?.message;

  const errorMessage = strapiErrors || zodErrors || formState?.errorMessage;
  const successMessage = formState?.successMessage;


  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <CustomTextInput
          name="email"
          type="text"
          placeholder={errorMessage || successMessage || placeholder}
          className={`newsletter__email ${errorMessage ? "newsletter__email--error" : ""}`}
        />
        <CustomButton
          type="submit"
          variant="contained"
          size="large"
        >
          {buttonText}
        </CustomButton>
      </form>
    </section>
  );
}
