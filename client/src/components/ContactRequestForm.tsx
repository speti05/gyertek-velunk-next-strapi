"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { contactRequestAction } from "@/data/actions";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomTextInput from "@/components/custom-ui-components/custom-text-input/custom-text-input";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import CustomRadioGroup from "@/components/custom-ui-components/custom-radio/custom-radio";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import {
  CONTACT_REQUEST_TITLE,
  CONTACT_REQUEST_SUBTITLE_PREFIX,
  CONTACT_REQUEST_SUBTITLE_LINK,
  CONTACT_REQUEST_SUBTITLE_SUFFIX,
  CONTACT_REQUEST_NAME_LABEL,
  CONTACT_REQUEST_PHONE_LABEL,
  CONTACT_REQUEST_EMAIL_LABEL,
  CONTACT_REQUEST_PREFERRED_LABEL,
  CONTACT_REQUEST_PHONE_OPTION,
  CONTACT_REQUEST_EMAIL_OPTION,
  CONTACT_REQUEST_SUBMIT_LABEL,
  CONTACT_REQUEST_NEW_REQUEST_LABEL,
} from "@/utils/texts";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

const CONTACT_OPTIONS = [
  { value: "phone", label: CONTACT_REQUEST_PHONE_OPTION },
  { value: "email", label: CONTACT_REQUEST_EMAIL_OPTION },
];

export function ContactRequestForm() {
  const [formState, formAction] = useActionState(contactRequestAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "contact_request");

  const [preferredContact, setPreferredContact] = useState<"phone" | "email">("phone");
  const [formKey, setFormKey] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (!formState?.successMessage) return;
    setSucceeded(true);
  }, [formState?.successMessage]);

  const zodErrors = formState?.zodErrors as Record<string, string[]> | null;

  function handleReset() {
    setSucceeded(false);
    setFormKey((k) => k + 1);
    setPreferredContact("phone");
  }

  return (
    <section className="contact-request" id="contact-request">
      <div className="contact-request__inner">
        <div className="contact-request__info">
          <h3 className="contact-request__title">{CONTACT_REQUEST_TITLE}</h3>
          <p className="contact-request__subtitle">
            {CONTACT_REQUEST_SUBTITLE_PREFIX}
            <CustomLink href="/login">{CONTACT_REQUEST_SUBTITLE_LINK}</CustomLink>
            {CONTACT_REQUEST_SUBTITLE_SUFFIX}
          </p>
        </div>

        {succeeded ? (
          <div className="contact-request__success">
            <CustomAlertMessage successMessage={formState?.successMessage} />
            <CustomButton variant="outlined" size="large" onClick={handleReset}>
              {CONTACT_REQUEST_NEW_REQUEST_LABEL}
            </CustomButton>
          </div>
        ) : (
          <form
            key={formKey}
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-request__form"
          >
            <CustomTextInput
              name="name"
              label={CONTACT_REQUEST_NAME_LABEL}
              error={zodErrors?.name?.[0]}
            />

            <CustomRadioGroup
              name="preferredContact"
              label={CONTACT_REQUEST_PREFERRED_LABEL}
              options={CONTACT_OPTIONS}
              value={preferredContact}
              onChange={(val) => setPreferredContact(val as "phone" | "email")}
            />

            {preferredContact === "phone" && (
              <CustomTextInput
                name="phone"
                label={CONTACT_REQUEST_PHONE_LABEL}
                type="tel"
                error={zodErrors?.phone?.[0]}
              />
            )}

            {preferredContact === "email" && (
              <CustomTextInput
                name="email"
                label={CONTACT_REQUEST_EMAIL_LABEL}
                type="email"
                error={zodErrors?.email?.[0]}
              />
            )}

            {formState?.errorMessage && (
              <CustomAlertMessage errorMessage={formState.errorMessage} />
            )}

            <CustomButton type="submit" variant="contained" size="large">
              {CONTACT_REQUEST_SUBMIT_LABEL}
            </CustomButton>
          </form>
        )}
      </div>
    </section>
  );
}
