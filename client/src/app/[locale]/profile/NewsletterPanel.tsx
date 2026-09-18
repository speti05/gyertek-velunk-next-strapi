"use client";

import { useTexts } from "@/context/locale-context";

import { useActionState, useEffect, useRef, useState } from "react";
import { toggleNewsletterSubscriptionAction } from "@/data/auth-actions";
import { CustomCheckbox } from "@/components/custom-ui-components/custom-checkbox/custom-checkbox";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";

interface NewsletterPanelProps {
  isNewsletterSubscribed: boolean;
}

/**
 * The subscription is a single switch that saves itself, so it sits beside the identity
 * card in the sidebar rather than in the profile form, whose fields are only written on
 * an explicit save.
 */
export function NewsletterPanel({ isNewsletterSubscribed }: NewsletterPanelProps) {
  const { PROFILE_NEWSLETTER_SECTION, PROFILE_NEWSLETTER_SUBSCRIBE_LABEL, PROFILE_NEWSLETTER_HINT } =
    useTexts();
  const [newsletterState, newsletterAction] = useActionState(toggleNewsletterSubscriptionAction, {
    subscribed: isNewsletterSubscribed,
    errorMessage: null,
    successMessage: null,
  });
  const newsletterFormRef = useRef<HTMLFormElement>(null);
  const [newsletterSuccessMsg, setNewsletterSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!newsletterState?.successMessage) return;
    setNewsletterSuccessMsg(newsletterState.successMessage);
    const t = setTimeout(() => setNewsletterSuccessMsg(null), 5000);
    return () => clearTimeout(t);
  }, [newsletterState?.successMessage]);

  return (
    <section className="profile-panel profile-panel--compact">
      <h2 className="profile-panel__title">{PROFILE_NEWSLETTER_SECTION}</h2>
      <p className="profile-panel__subtitle">{PROFILE_NEWSLETTER_HINT}</p>
      <form action={newsletterAction} ref={newsletterFormRef} className="profile-panel__body">
        <input
          type="hidden"
          name="subscribe"
          value={newsletterState.subscribed ? "false" : "true"}
        />
        <CustomCheckbox
          label={PROFILE_NEWSLETTER_SUBSCRIBE_LABEL}
          checked={newsletterState.subscribed}
          size="large"
          onChange={() => newsletterFormRef.current?.requestSubmit()}
        />
        <CustomAlertMessage
          errorMessage={newsletterState.errorMessage}
          successMessage={newsletterSuccessMsg}
        />
      </form>
    </section>
  );
}
