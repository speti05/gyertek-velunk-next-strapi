"use client";

import { useActionState } from "react";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "@/components/StrapiImage";
import { SubmitButton } from "@/components/SubmitButton";
import { eventsSubscribeAction } from "@/data/actions";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
  formData: null,
};

export function EventSignupForm({
  blocks,
  eventId,
  startDate,
  price,
  image,
}: {
  blocks: Block[];
  eventId: string;
  startDate?: string;
  price?: string;
  image?: {
    url: string;
    alt: string;
  };
}) {
  const [formState, formAction] = useActionState(
    eventsSubscribeAction,
    INITIAL_STATE
  );

  const zodErrors = formState?.zodErrors;
  const strapiErrors = formState?.strapiErrors?.message;
  const successMessage = formState?.successMessage;

  const FORM_LABELS = {
    firstName: "Keresztnév",
    lastName: "Vezetéknév",
    email: "Email",
    telephone: "Telefon",
    submit: "Regisztráció",
  };

  return (
    <section className="signup-form">
      <div className="signup-form__info">
        <BlockRenderer blocks={blocks} />
        {startDate && (
          <p className="signup-form__date">
            <span>StartDate:</span> {formatDate(startDate)}
          </p>
        )}
        {price && (
          <p className="signup-form__price">
            <span>Price:</span> {price}
          </p>
        )}
      </div>
      <form className="signup-form__form" action={formAction}>
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
        <input hidden type="text" name="eventId" defaultValue={eventId} />
        <SubmitButton
          text={FORM_LABELS.submit}
        />
        {strapiErrors && <p className="signup-form__error">{strapiErrors}</p>}
        {successMessage && (
          <p className="signup-form__success">{successMessage}</p>
        )}
      </form>
    </section>
  );
}
