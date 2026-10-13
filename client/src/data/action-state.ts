import type { StrapiError } from "@/types";

/** Zod's `flatten().fieldErrors`: messages per form field. */
export type FieldErrors = Record<string, string[] | undefined>;

/** The state every form server action takes and returns through useActionState. */
export interface FormActionState {
  zodErrors?: FieldErrors | null;
  strapiErrors?: StrapiError | null;
  errorMessage?: string | null;
  successMessage?: string | null;
  unconfirmedEmail?: string | null;
}

export interface NewsletterToggleState {
  subscribed: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}
