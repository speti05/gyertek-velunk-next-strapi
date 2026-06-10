"use client";

import { useActionState, useRef, useState } from "react";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "@/components/StrapiImage";
import { eventsSubscribeAction } from "@/data/actions";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { useRecaptchaSubmit } from "@/hooks/use-recaptcha-submit";
import { UserProfile } from "@/data/auth-service";
import {
  FORM_LABELS,
  SIGNUP_BUTTON_LABEL,
  SIGNUP_CONFIRM_TITLE,
  SIGNUP_CONFIRM_YES,
  SIGNUP_CONFIRM_NO,
  SIGNUP_LOGIN_REQUIRED,
  SIGNUP_LOGIN_LINK,
  SIGNUP_PROFILE_INCOMPLETE,
  SIGNUP_PROFILE_LINK,
  SIGNUP_ALREADY_SIGNED_UP,
  SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL,
  SIGNUP_TOUR_INFO_IN_PROFILE,
} from "@/utils/texts";
import Link from "next/link";
import Button from "@mui/material/Button";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import { CustomCheckbox } from "@/components/custom-ui-components/custom-checkbox/custom-checkbox";
import { margin } from "polished";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

type EventSignupFormProps = {
  stayInTouchEventId?: string;
  blocks: Block[];
  eventId: string;
  eventTitle: string;
  startDate?: string;
  price?: string;
  image?: {
    url: string;
    alt: string;
  };
  userProfile: UserProfile | null;
  alreadySignedUp: boolean;
};

function EventSignupFormInner({
  stayInTouchEventId,
  blocks,
  eventId,
  eventTitle,
  startDate,
  price,
  image,
  userProfile,
  alreadySignedUp,
}: EventSignupFormProps) {
  const [formState, formAction] = useActionState(eventsSubscribeAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useRecaptchaSubmit(formRef, formAction, "event_signup");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [awaitEmailConfirmed, setAwaitEmailConfirmed] = useState(false);

  function handleDialogClose() {
    setDialogOpen(false);
    setAwaitEmailConfirmed(false);
  }

  const errorMessage = formState?.strapiErrors?.message ?? formState?.errorMessage;
  const successMessage = formState?.successMessage;

  const hasCompleteProfile = !!(
    userProfile?.firstName &&
    userProfile?.lastName &&
    userProfile?.phone
  );

  function renderSignupArea() {
    if (successMessage) return null;

    const isDisabled = alreadySignedUp || !userProfile || !hasCompleteProfile;

    return (
      <>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          color="primary"
          size="large"
          disabled={isDisabled}
          onClick={isDisabled ? undefined : () => setDialogOpen(true)}
          className="signup-form__submit-btn"
        >
          {SIGNUP_BUTTON_LABEL}
        </Button>

        {alreadySignedUp && <CustomAlertMessage infoMessage={SIGNUP_ALREADY_SIGNED_UP} />}

        {!alreadySignedUp && !userProfile && (
          <CustomAlertMessage
            infoMessage={
              <>
                {SIGNUP_LOGIN_REQUIRED}{" "}
                <Link href="/login" className="signup-form__status-link">
                  {SIGNUP_LOGIN_LINK}
                </Link>
                .
              </>
            }
          />
        )}

        {!alreadySignedUp && userProfile && !hasCompleteProfile && (
          <CustomAlertMessage
            infoMessage={
              <>
                {SIGNUP_PROFILE_INCOMPLETE}{" "}
                <Link href="/profile" className="signup-form__status-link">
                  {SIGNUP_PROFILE_LINK}
                </Link>
                .
              </>
            }
          />
        )}
      </>
    );
  }

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

        <input hidden type="text" name="eventId" defaultValue={eventId ?? stayInTouchEventId} />

        {renderSignupArea()}

        <CustomAlertMessage errorMessage={errorMessage} successMessage={successMessage} />
      </form>

      <CustomDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title={SIGNUP_CONFIRM_TITLE}
        cancelLabel={SIGNUP_CONFIRM_NO}
        confirmLabel={SIGNUP_CONFIRM_YES}
        confirmDisabled={!awaitEmailConfirmed}
        onConfirm={() => {
          handleDialogClose();
          formRef.current?.requestSubmit();
        }}
      >
        <div className="my-6">
          <h4 className="text-center">{eventTitle}</h4>
          <div className="grid grid-cols-2 gap-4 mt-10 mb-10">
            {startDate && (
              <>
                <span>
                  <strong>{FORM_LABELS.startDate}:</strong>
                </span>
                <span>{formatDate(startDate)}</span>
              </>
            )}
            {price && (
              <>
                <span>
                  <strong>{FORM_LABELS.price}:</strong>
                </span>
                <span>{price}</span>
              </>
            )}
          </div>
        </div>
        <CustomAlertMessage warningMessage={SIGNUP_TOUR_INFO_IN_PROFILE} />
        <CustomCheckbox
          sx={{ marginTop: margin(10) }}
          checked={awaitEmailConfirmed}
          size="large"
          onChange={(e) => setAwaitEmailConfirmed((e.target as HTMLInputElement).checked)}
          label={SIGNUP_CONFIRM_AWAIT_EMAIL_LABEL}
        />
      </CustomDialog>
    </section>
  );
}

export function EventSignupForm(props: EventSignupFormProps) {
  return <EventSignupFormInner {...props} />;
}
