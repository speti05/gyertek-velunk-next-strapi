"use client";

import { useActionState, useRef } from "react";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "@/components/StrapiImage";
import { SubmitButton } from "@/components/SubmitButton";
import { eventsSubscribeAction } from "@/data/actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { FORM_LABELS } from "@/utils/texts";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
  formData: null,
};

// TODO: fix this hardcoded id (id of the "stay in touch" event)
const DEFAULT_SIGNUP_ID = "hakunoc6kul1z6lbf4j2ritt";

type EventSignupFormProps = {
  stayInTouchEventId?: string;
  blocks: Block[];
  eventId: string;
  startDate?: string;
  price?: string;
  image?: {
    url: string;
    alt: string;
  };
};

function EventSignupFormInner({
  stayInTouchEventId,
  blocks,
  eventId,
  startDate,
  price,
  image,
}: EventSignupFormProps) {
  const [formState, formAction] = useActionState(
    eventsSubscribeAction,
    INITIAL_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "event_signup");

  const zodErrors = formState?.zodErrors;
  const errorMessage = formState?.strapiErrors?.message ?? formState?.errorMessage;
  const successMessage = formState?.successMessage;

  return (
    <section className="signup-form">
      <div className="signup-form__info">
        <BlockRenderer blocks={blocks} />
        {startDate && (
          <p className="signup-form__date">
            <span>{FORM_LABELS.startDate}:</span> {formatDate(startDate)}
          </p>
        )}
        {price && (
          <p className="signup-form__price">
            <span>{FORM_LABELS.price}:</span> {price}
          </p>
        )}
      </div>
      <form ref={formRef} className="signup-form__form" onSubmit={handleSubmit}>
        {image && (
          <StrapiImage
            src={image.url}
            alt={image.alt}
            height={200}
            width={200}
            className="signup-form__image"
          />
        )}
        <div className="signup-form__name-container">
          <CustomTextInput
            id="lastName"
            label={FORM_LABELS.lastName}
            name="lastName"
            error={zodErrors?.lastName}
            defaultValue={formState?.formData?.lastName ?? ""}
          />
          <CustomTextInput
            id="firstName"
            label={FORM_LABELS.firstName}
            name="firstName"
            error={zodErrors?.firstName}
            defaultValue={formState?.formData?.firstName ?? ""}
          />
        </div>
        <CustomTextInput
          id="email"
          label={FORM_LABELS.email}
          name="email"
          type="email"
          error={zodErrors?.email}
          defaultValue={formState?.formData?.email ?? ""}
        />
        <CustomTextInput
          id="phone"
          label={FORM_LABELS.telephone}
          name="telephone"
          type="text"
          error={zodErrors?.telephone}
          defaultValue={formState?.formData?.telephone ?? ""}
        />
        <input hidden type="text" name="eventId" defaultValue={eventId ?? stayInTouchEventId} />
        <SubmitButton
          text={FORM_LABELS.submit}
        />
        <CustomAlertMessage errorMessage={errorMessage} successMessage={successMessage} />
      </form>
    </section>
  );
}

export function EventSignupForm(props: EventSignupFormProps) {
  return (
    <RecaptchaProvider>
      <EventSignupFormInner {...props} />
    </RecaptchaProvider>
  );
}
