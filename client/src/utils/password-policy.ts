import {
  MIN_PASSWORD,
  MAX_PASSWORD,
} from "@/components/custom-ui-components/custom-text-input/input-length-limits";

/**
 * Single source of the password policy. The server-side zod schemas in
 * `data/auth-actions.ts` and the live checklist in `PasswordStrengthHint` both read
 * from here, so registration and password reset always enforce the same rules.
 */
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

export const PASSWORD_RULE_TESTS = {
  length: (p: string) => p.length >= MIN_PASSWORD && p.length <= MAX_PASSWORD,
  mixedCase: (p: string) => PASSWORD_LOWERCASE_REGEX.test(p) && PASSWORD_UPPERCASE_REGEX.test(p),
  special: (p: string) => PASSWORD_SPECIAL_REGEX.test(p),
};
