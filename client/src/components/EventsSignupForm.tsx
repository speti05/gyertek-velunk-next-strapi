"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "@/components/StrapiImage";
import { eventsSubscribeAction } from "@/data/actions";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { useRecaptchaAction } from "@/hooks/use-recaptcha-action";
import { UserProfile } from "@/data/auth-service";
import {
  FORM_LABELS,
  SIGNUP_BUTTON_LABEL,
  SIGNUP_LOGIN_REQUIRED,
  SIGNUP_LOGIN_LINK,
  SIGNUP_PROFILE_INCOMPLETE,
  SIGNUP_PROFILE_LINK,
  SIGNUP_ALREADY_SIGNED_UP,
  SIGNUP_SUCCESS_TITLE,
  SIGNUP_SUCCESS_CONTENT,
  SIGNUP_SUCCESS_EMAIL_INFO,
  SIGNUP_SUCCESS_PROFILE_INFO,
  SIGNUP_SUCCESS_OK_LABEL,
  CURRENCY,
} from "@/utils/texts";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import { TourSignupDialog, SignupFormData } from "@/components/TourSignupDialog";
import { TourDifficultyBadge } from "@/components/TourDifficultyBadge";

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
  eventTitle?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  difficulty?: number;
  image?: {
    url: string;
    alt: string;
  };
  userProfile?: UserProfile | null;
  alreadySignedUp?: boolean;
};

function EventSignupFormInner({
  stayInTouchEventId,
  blocks,
  eventId,
  eventTitle = "",
  startDate,
  endDate,
  price,
  difficulty,
  image,
  userProfile = null,
  alreadySignedUp = false,
}: EventSignupFormProps) {
  const [formState, formAction] = useActionState(eventsSubscribeAction, INITIAL_STATE);
  const dispatch = useRecaptchaAction(formAction, "event_signup");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (formState?.successMessage) {
      setDialogOpen(false);
      setSuccessDialogOpen(true);
    }
  }, [formState?.successMessage]);

  async function handleSignupComplete(data: SignupFormData) {
    const formData = new FormData();
    formData.set("eventId", eventId ?? stayInTouchEventId ?? "");
    formData.set("signupData", JSON.stringify(data));
    await dispatch(formData);
  }

  const errorMessage = formState?.strapiErrors?.message ?? formState?.errorMessage;
  const successMessage = formState?.successMessage;

  const hasCompleteProfile = !!(
    userProfile?.firstName &&
    userProfile?.lastName &&
    userProfile?.phone &&
    userProfile?.country &&
    userProfile?.city &&
    userProfile?.zip &&
    userProfile?.street &&
    userProfile?.houseNumber
  );

  function renderSignupArea() {
    if (successMessage) return null;

    const isDisabled = alreadySignedUp || !userProfile || !hasCompleteProfile;

    return (
      <>
        <CustomButton
          sx={{ width: "100%" }}
          variant="contained"
          color="primary"
          size="large"
          disabled={isDisabled}
          onClick={isDisabled ? undefined : () => setDialogOpen(true)}
          className="signup-form__submit-btn"
        >
          {SIGNUP_BUTTON_LABEL}
        </CustomButton>

        {alreadySignedUp && <CustomAlertMessage infoMessage={SIGNUP_ALREADY_SIGNED_UP} />}

        {!alreadySignedUp && !userProfile && (
          <CustomAlertMessage
            infoMessage={
              <>
                {SIGNUP_LOGIN_REQUIRED}{" "}
                <CustomLink href="/login" color="primary">
                  {SIGNUP_LOGIN_LINK}
                </CustomLink>
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
                <CustomLink href="/profile" color="primary">
                  {SIGNUP_PROFILE_LINK}
                </CustomLink>
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
        {endDate && (
          <p className="signup-form__date">
            <span>{FORM_LABELS.endDate}:</span> {formatDate(endDate)}
          </p>
        )}
        {price && (
          <p className="signup-form__price">
            <span>
              {FORM_LABELS.price}: {price}
            </span>
            <span>{CURRENCY}</span>
          </p>
        )}
        {difficulty && <TourDifficultyBadge difficulty={difficulty} />}
      </div>

      <div className="signup-form__form">
        {image && (
          <StrapiImage
            src={image.url}
            alt={image.alt}
            height={200}
            width={200}
            className="signup-form__image"
          />
        )}

        {renderSignupArea()}

        <CustomAlertMessage errorMessage={errorMessage} successMessage={successMessage} />
      </div>

      {userProfile && hasCompleteProfile && !alreadySignedUp && (
        <TourSignupDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onComplete={handleSignupComplete}
          userProfile={userProfile}
          eventTitle={eventTitle}
          startDate={startDate}
          endDate={endDate}
          price={price}
        />
      )}

      <CustomDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title={SIGNUP_SUCCESS_TITLE(eventTitle)}
        actions={
          <CustomButton
            variant="contained"
            color="primary"
            sx={{ flex: 1, m: 1 }}
            onClick={() => setSuccessDialogOpen(false)}
          >
            {SIGNUP_SUCCESS_OK_LABEL}
          </CustomButton>
        }
      >
        <p style={{ textAlign: "center", marginBottom: "16px" }}>{SIGNUP_SUCCESS_CONTENT}</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <Image src="/GYERTEK V_kor.png" alt="Gyertek Velünk" width={120} height={120} />
        </div>
        <CustomAlertMessage infoMessage={SIGNUP_SUCCESS_EMAIL_INFO} />
        <CustomAlertMessage infoMessage={SIGNUP_SUCCESS_PROFILE_INFO} />
      </CustomDialog>
    </section>
  );
}

export function EventSignupForm(props: EventSignupFormProps) {
  return <EventSignupFormInner {...props} />;
}
