"use client";

import { EventSignupEntry } from "@/data/loaders";
import CustomAccordion from "@/components/custom-ui-components/custom-accordion/custom-accordion";
import {
  PROFILE_SIGNUP_DETAILS_SHOW,
  FORM_LABELS,
  SIGNUP_STEP_BILLING,
  SIGNUP_STEP_TRAVEL,
  SIGNUP_STEP_COMPANIONS,
  SIGNUP_TRAVEL_BIRTH_COUNTRY,
  SIGNUP_TRAVEL_BIRTH_PLACE,
  SIGNUP_TRAVEL_BIRTH_DATE,
  SIGNUP_TRAVEL_DOCUMENT_TYPE,
  SIGNUP_TRAVEL_DOCUMENT_NUMBER,
  SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE,
  SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE,
  SIGNUP_TRAVEL_ALLERGIES,
  SIGNUP_TRAVEL_FB_LINK,
  SIGNUP_SUMMARY_NOTES,
  SIGNUP_BILLING_WANT_INVOICE,
  SIGNUP_BILLING_COMPANY_NAME,
  SIGNUP_BILLING_TAX_NUMBER,
  SIGNUP_COMPANION_TITLE,
  SIGNUP_SUMMARY_TOTAL_PRICE,
  CURRENCY,
} from "@/utils/texts";
import { formatDate } from "@/utils/format-date";

interface SignupDetailsToggleProps {
  signup: EventSignupEntry;
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div className="auth-page__signup-detail-row">
      <span className="auth-page__signup-detail-label">{label}:</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="auth-page__signup-detail-value"
        >
          {value}
        </a>
      ) : (
        <span className="auth-page__signup-detail-value">{value}</span>
      )}
    </div>
  );
}

export function SignupDetailsToggle({ signup }: SignupDetailsToggleProps) {
  const totalPrice = signup.event?.price
    ? parseFloat(signup.event.price.replace(/[^0-9.]/g, "")) *
      (1 + (signup.companions?.length ?? 0))
    : null;

  return (
    <div className="auth-page__signup-details">
      <CustomAccordion title={PROFILE_SIGNUP_DETAILS_SHOW} sx={{ width: "100%" }}>
        <div className="auth-page__signup-details-content">
          <div className="auth-page__signup-details-section">
            <h4 className="auth-page__signup-details-section-title">{SIGNUP_STEP_BILLING}</h4>
            <DetailRow label={FORM_LABELS.lastName} value={signup.lastName} />
            <DetailRow label={FORM_LABELS.firstName} value={signup.firstName} />
            <DetailRow label={FORM_LABELS.telephone} value={signup.telephone} />
            <DetailRow label={FORM_LABELS.country} value={signup.billingCountry} />
            <DetailRow label={FORM_LABELS.city} value={signup.billingCity} />
            <DetailRow label={FORM_LABELS.zip} value={signup.billingZip} />
            <DetailRow label={FORM_LABELS.street} value={signup.billingStreet} />
            <DetailRow label={FORM_LABELS.houseNumber} value={signup.billingHouseNumber} />
            {signup.wantInvoice && (
              <>
                <DetailRow label={SIGNUP_BILLING_WANT_INVOICE} value="Igen" />
                <DetailRow label={SIGNUP_BILLING_COMPANY_NAME} value={signup.companyName} />
                <DetailRow label={SIGNUP_BILLING_TAX_NUMBER} value={signup.taxNumber} />
              </>
            )}
          </div>

          <div className="auth-page__signup-details-section">
            <h4 className="auth-page__signup-details-section-title">{SIGNUP_STEP_TRAVEL}</h4>
            <DetailRow label={SIGNUP_TRAVEL_BIRTH_COUNTRY} value={signup.birthCountry} />
            <DetailRow label={SIGNUP_TRAVEL_BIRTH_PLACE} value={signup.birthPlace} />
            <DetailRow
              label={SIGNUP_TRAVEL_BIRTH_DATE}
              value={signup.birthDate ? formatDate(signup.birthDate) : null}
            />
            <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_TYPE} value={signup.documentType} />
            <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_NUMBER} value={signup.documentNumber} />
            <DetailRow
              label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
              value={signup.documentIssueDate ? formatDate(signup.documentIssueDate) : null}
            />
            <DetailRow
              label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
              value={signup.documentExpiryDate ? formatDate(signup.documentExpiryDate) : null}
            />
            <DetailRow label={SIGNUP_TRAVEL_ALLERGIES} value={signup.allergies} />
            <DetailRow
              label={SIGNUP_TRAVEL_FB_LINK}
              value={signup.fbLink}
              href={signup.fbLink ?? undefined}
            />
          </div>

          {signup.companions && signup.companions.length > 0 && (
            <div className="auth-page__signup-details-section">
              <h4 className="auth-page__signup-details-section-title">{SIGNUP_STEP_COMPANIONS}</h4>
              {signup.companions.map((companion, idx) => (
                <div key={idx} className="auth-page__signup-companion">
                  <h5 className="auth-page__signup-details-section_companion-title">
                    {SIGNUP_COMPANION_TITLE(idx + 1)}
                  </h5>
                  <DetailRow
                    label={`${FORM_LABELS.lastName} / ${FORM_LABELS.firstName}`}
                    value={`${companion.lastName} ${companion.firstName}`}
                  />
                  <DetailRow label={FORM_LABELS.telephone} value={companion.phone} />
                  <DetailRow label={SIGNUP_TRAVEL_BIRTH_COUNTRY} value={companion.birthCountry} />
                  <DetailRow label={SIGNUP_TRAVEL_BIRTH_PLACE} value={companion.birthPlace} />
                  <DetailRow
                    label={SIGNUP_TRAVEL_BIRTH_DATE}
                    value={companion.birthDate ? formatDate(companion.birthDate) : null}
                  />
                  <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_TYPE} value={companion.documentType} />
                  <DetailRow
                    label={SIGNUP_TRAVEL_DOCUMENT_NUMBER}
                    value={companion.documentNumber}
                  />
                  <DetailRow
                    label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
                    value={
                      companion.documentIssueDate ? formatDate(companion.documentIssueDate) : null
                    }
                  />
                  <DetailRow
                    label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
                    value={
                      companion.documentExpiryDate ? formatDate(companion.documentExpiryDate) : null
                    }
                  />
                  <DetailRow label={SIGNUP_TRAVEL_ALLERGIES} value={companion.allergies} />
                  <DetailRow
                    label={SIGNUP_TRAVEL_FB_LINK}
                    value={companion.fbLink}
                    href={companion.fbLink ?? undefined}
                  />
                </div>
              ))}
            </div>
          )}

          {signup.notes && (
            <div className="auth-page__signup-details-section">
              <h4 className="auth-page__signup-details-section-title">{SIGNUP_SUMMARY_NOTES}</h4>
              <span className="auth-page__signup-detail-value">{signup.notes}</span>
            </div>
          )}

          {totalPrice !== null && (
            <div className="auth-page__signup-details-section">
              <DetailRow
                label={SIGNUP_SUMMARY_TOTAL_PRICE}
                value={`${totalPrice.toLocaleString("hu-HU")} ${CURRENCY}`}
              />
            </div>
          )}
        </div>
      </CustomAccordion>
    </div>
  );
}
