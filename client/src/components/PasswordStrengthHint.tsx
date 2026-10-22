"use client";

import { useTexts } from "@/context/locale-context";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";

/** Live checklist of the password policy, shown under a new-password field. */
export function PasswordStrengthHint({ password }: { password: string }) {
  const { PASSWORD_RULES } = useTexts();
  return (
    <ul className="auth-page__password-rules">
      {PASSWORD_RULES.map((rule) => (
        <li
          key={rule.label}
          className={`auth-page__password-rule${rule.test(password) ? " auth-page__password-rule--met" : ""}`}
        >
          <CustomIcon name={rule.test(password) ? "checked" : "unchecked"}></CustomIcon>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
