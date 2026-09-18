"use client";

import { useLocale, useTexts } from "@/context/locale-context";

import type { EventSignupEntry } from "@/data/loaders";
import CustomAccordion from "@/components/custom-ui-components/custom-accordion/custom-accordion";
import { formatDate } from "@/utils/format-date";

interface SignupDetailsToggleProps {
  signup: EventSignupEntry;
}

/**
 * One label/value pair of the details grid. The label sits above the value rather than
 * beside it: several of these labels are long enough that an inline pair wrapped on
 * nearly every row, which is what made the old single-column list so tall.
 */
function DetailRow({
  label,
  value,
  href,
  isFullWidth = false,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
  isFullWidth?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={`profile-details__row${isFullWidth ? " profile-details__row--full" : ""}`}>
      <dt className="profile-details__label">{label}</dt>
      <dd className="profile-details__value">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-details__value"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function SignupDetailsToggle({ signup }: SignupDetailsToggleProps) {
  const { PROFILE_SIGNUP_DETAILS_SHOW, FORM_LABELS, SIGNUP_STEP_BILLING, SIGNUP_STEP_TRAVEL, SIGNUP_STEP_COMPANIONS, SIGNUP_TRAVEL_BIRTH_COUNTRY, SIGNUP_TRAVEL_BIRTH_PLACE, SIGNUP_TRAVEL_BIRTH_DATE, SIGNUP_TRAVEL_DOCUMENT_TYPE, SIGNUP_TRAVEL_DOCUMENT_NUMBER, SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE, SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE, SIGNUP_TRAVEL_ALLERGIES, SIGNUP_TRAVEL_FB_LINK, SIGNUP_SUMMARY_NOTES, SIGNUP_BILLING_WANT_INVOICE, SIGNUP_BILLING_COMPANY_NAME, SIGNUP_BILLING_TAX_NUMBER, SIGNUP_COMPANION_TITLE, SIGNUP_SUMMARY_TOTAL_PRICE, SIGNUP_CONFIRM_YES, CURRENCY } = useTexts();
  const locale = useLocale();
  const totalPrice = signup.event?.price
    ? parseFloat(signup.event.price.replace(/[^0-9.]/g, "")) *
      (1 + (signup.companions?.length ?? 0))
    : null;

  return (
    <div className="profile-details">
      <CustomAccordion title={PROFILE_SIGNUP_DETAILS_SHOW} sx={{ width: "100%" }}>
        <div className="profile-details__content">
          <section className="profile-details__section">
            <h4 className="profile-details__section-title">{SIGNUP_STEP_BILLING}</h4>
            <dl className="profile-details__grid">
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
                  <DetailRow label={SIGNUP_BILLING_WANT_INVOICE} value={SIGNUP_CONFIRM_YES} />
                  <DetailRow label={SIGNUP_BILLING_COMPANY_NAME} value={signup.companyName} />
                  <DetailRow label={SIGNUP_BILLING_TAX_NUMBER} value={signup.taxNumber} />
                </>
              )}
            </dl>
          </section>

          <section className="profile-details__section">
            <h4 className="profile-details__section-title">{SIGNUP_STEP_TRAVEL}</h4>
            <dl className="profile-details__grid">
              <DetailRow label={SIGNUP_TRAVEL_BIRTH_COUNTRY} value={signup.birthCountry} />
              <DetailRow label={SIGNUP_TRAVEL_BIRTH_PLACE} value={signup.birthPlace} />
              <DetailRow
                label={SIGNUP_TRAVEL_BIRTH_DATE}
                value={signup.birthDate ? formatDate(signup.birthDate, locale) : null}
              />
              <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_TYPE} value={signup.documentType} />
              <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_NUMBER} value={signup.documentNumber} />
              <DetailRow
                label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
                value={signup.documentIssueDate ? formatDate(signup.documentIssueDate, locale) : null}
              />
              <DetailRow
                label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
                value={
                  signup.documentExpiryDate ? formatDate(signup.documentExpiryDate, locale) : null
                }
              />
              <DetailRow
                label={SIGNUP_TRAVEL_ALLERGIES}
                value={signup.allergies}
                isFullWidth={true}
              />
              <DetailRow
                label={SIGNUP_TRAVEL_FB_LINK}
                value={signup.fbLink}
                href={signup.fbLink ?? undefined}
                isFullWidth={true}
              />
            </dl>
          </section>

          {signup.companions && signup.companions.length > 0 && (
            <section className="profile-details__section">
              <h4 className="profile-details__section-title">{SIGNUP_STEP_COMPANIONS}</h4>
              {signup.companions.map((companion, idx) => (
                <div key={idx} className="profile-details__companion">
                  <h5 className="profile-details__companion-title">
                    {SIGNUP_COMPANION_TITLE(idx + 1)}
                  </h5>
                  <dl className="profile-details__grid">
                    <DetailRow
                      label={`${FORM_LABELS.lastName} / ${FORM_LABELS.firstName}`}
                      value={`${companion.lastName} ${companion.firstName}`}
                    />
                    <DetailRow label={FORM_LABELS.telephone} value={companion.phone} />
                    <DetailRow label={SIGNUP_TRAVEL_BIRTH_COUNTRY} value={companion.birthCountry} />
                    <DetailRow label={SIGNUP_TRAVEL_BIRTH_PLACE} value={companion.birthPlace} />
                    <DetailRow
                      label={SIGNUP_TRAVEL_BIRTH_DATE}
                      value={companion.birthDate ? formatDate(companion.birthDate, locale) : null}
                    />
                    <DetailRow label={SIGNUP_TRAVEL_DOCUMENT_TYPE} value={companion.documentType} />
                    <DetailRow
                      label={SIGNUP_TRAVEL_DOCUMENT_NUMBER}
                      value={companion.documentNumber}
                    />
                    <DetailRow
                      label={SIGNUP_TRAVEL_DOCUMENT_ISSUE_DATE}
                      value={
                        companion.documentIssueDate
                          ? formatDate(companion.documentIssueDate, locale)
                          : null
                      }
                    />
                    <DetailRow
                      label={SIGNUP_TRAVEL_DOCUMENT_EXPIRY_DATE}
                      value={
                        companion.documentExpiryDate
                          ? formatDate(companion.documentExpiryDate, locale)
                          : null
                      }
                    />
                    <DetailRow
                      label={SIGNUP_TRAVEL_ALLERGIES}
                      value={companion.allergies}
                      isFullWidth={true}
                    />
                    <DetailRow
                      label={SIGNUP_TRAVEL_FB_LINK}
                      value={companion.fbLink}
                      href={companion.fbLink ?? undefined}
                      isFullWidth={true}
                    />
                  </dl>
                </div>
              ))}
            </section>
          )}

          {signup.notes && (
            <section className="profile-details__section">
              <h4 className="profile-details__section-title">{SIGNUP_SUMMARY_NOTES}</h4>
              <p className="profile-details__value">{signup.notes}</p>
            </section>
          )}

          {totalPrice !== null && (
            <div className="profile-details__total">
              <span className="profile-details__total-label">{SIGNUP_SUMMARY_TOTAL_PRICE}</span>
              <span className="profile-details__total-value">
                {totalPrice.toLocaleString("hu-HU")} {CURRENCY}
              </span>
            </div>
          )}
        </div>
      </CustomAccordion>
    </div>
  );
}
