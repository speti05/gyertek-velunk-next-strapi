"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  updateUserProfileService,
  getUserProfileService,
} from "./auth-service";
import { isDev } from "@clientRoot/env";
import { MESSAGES, AUTH_FORGOT_PASSWORD_SUCCESS } from "@/utils/texts";

const STRAPI_URL = process.env.STRAPI_API_URL ?? "http://localhost:1337";

async function verifyRecaptcha(token: string | null): Promise<boolean> {
  if (isDev || !token) return true;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const res = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );
    const data = await res.json();
    return data.success && data.score >= 0.5;
  } catch {
    return false;
  }
}

const authSchema = z.object({
  email: z.string().email({ message: MESSAGES.emailInvalid }),
  password: z.string().min(6, { message: MESSAGES.invalidPassword }),
});

const registerSchema = z
  .object({
    email: z.string().email({ message: MESSAGES.emailInvalid }),
    password: z
      .string()
      .min(6, { message: MESSAGES.invalidPassword })
      .regex(/[A-Z]/, { message: MESSAGES.passwordNeedsUppercase })
      .regex(/[a-z]/, { message: MESSAGES.passwordNeedsLowercase })
      .regex(/[^A-Za-z0-9]/, { message: MESSAGES.passwordNeedsSpecial }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: MESSAGES.passwordMismatch,
    path: ["passwordConfirmation"],
  });

async function setAuthCookies(jwt: string, email: string) {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
  cookieStore.set("jwt", jwt, opts);
  cookieStore.set("user_email", email, opts);
}

export async function authAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { ...prevState, zodErrors: null, errorMessage: MESSAGES.recaptchaFailed };
  }

  const mode = formData.get("mode") as "login" | "register";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (mode === "login") {
    const validatedFields = authSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        ...prevState,
        zodErrors: validatedFields.error.flatten().fieldErrors,
        errorMessage: null,
      };
    }

    const data = await loginService(validatedFields.data.email, validatedFields.data.password);

    if (!data) {
      return { ...prevState, zodErrors: null, errorMessage: MESSAGES.tryAgain };
    }

    if (data.error) {
      return { ...prevState, zodErrors: null, errorMessage: MESSAGES.loginFailed };
    }

    await setAuthCookies(data.jwt!, data.user.email);
  } else if (mode === "register") {
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
    const validatedFields = registerSchema.safeParse({ email, password, passwordConfirmation });

    if (!validatedFields.success) {
      return {
        ...prevState,
        zodErrors: validatedFields.error.flatten().fieldErrors,
        errorMessage: null,
      };
    }

    const data = await registerService(validatedFields.data.email, validatedFields.data.password);

    if (!data) {
      return { ...prevState, zodErrors: null, errorMessage: MESSAGES.tryAgain };
    }

    if (data.error) {
      const isDuplicate =
        data.error.message.toLowerCase().includes("already taken") ||
        data.error.message.toLowerCase().includes("already exists");
      return {
        ...prevState,
        zodErrors: null,
        errorMessage: isDuplicate ? MESSAGES.emailAlreadyTaken : MESSAGES.registrationFailed,
      };
    }

    if (!data.jwt) {
      return {
        ...prevState,
        zodErrors: null,
        errorMessage: null,
        successMessage: MESSAGES.registrationEmailSent,
      };
    }

    await setAuthCookies(data.jwt, data.user.email);
  } else {
    console.warn("Invalid auth mode:", mode);
    return { ...prevState, zodErrors: null, errorMessage: MESSAGES.invalidOperation };
  }

  redirect("/profile");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("user_email");
  redirect("/login");
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: MESSAGES.emailInvalid }),
});

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { ...prevState, errorMessage: MESSAGES.recaptchaFailed, successMessage: null };
  }

  const email = formData.get("email") as string;
  const validated = forgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      ...prevState,
      zodErrors: validated.error.flatten().fieldErrors,
      successMessage: null,
    };
  }

  await forgotPasswordService(validated.data.email);

  // Always return success — never reveal if email is registered
  return {
    ...prevState,
    zodErrors: null,
    errorMessage: null,
    successMessage: AUTH_FORGOT_PASSWORD_SUCCESS,
  };
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: MESSAGES.invalidPassword }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: MESSAGES.passwordMismatch,
    path: ["passwordConfirmation"],
  });

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { ...prevState, zodErrors: null, errorMessage: MESSAGES.recaptchaFailed };
  }

  const code = formData.get("code") as string;
  const password = formData.get("password") as string;
  const passwordConfirmation = formData.get("passwordConfirmation") as string;

  const validated = resetPasswordSchema.safeParse({ password, passwordConfirmation });

  if (!validated.success) {
    return {
      ...prevState,
      zodErrors: validated.error.flatten().fieldErrors,
      errorMessage: null,
    };
  }

  const data = await resetPasswordService(
    code,
    validated.data.password,
    validated.data.passwordConfirmation
  );

  if (!data || data.error) {
    return { ...prevState, zodErrors: null, errorMessage: MESSAGES.tryAgain };
  }

  redirect("/login");
}

const phoneRegex = /^(\+36|06)\d{9}$/;

const profileSchema = z.object({
  firstName: z.string().min(1, { message: MESSAGES.invalidFirstName }),
  lastName: z.string().min(1, { message: MESSAGES.invalidLastName }),
  phone: z
    .string()
    .min(1, { message: MESSAGES.enterPhoneNumber })
    .regex(phoneRegex, { message: MESSAGES.invalidTelephone }),
});

export async function updateProfileAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  if (!jwt) redirect("/login");

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;

  const validated = profileSchema.safeParse({ firstName, lastName, phone });

  if (!validated.success) {
    return {
      ...prevState,
      zodErrors: validated.error.flatten().fieldErrors,
      successMessage: null,
      errorMessage: null,
    };
  }

  const profile = await getUserProfileService(jwt);
  if (!profile) {
    return { ...prevState, zodErrors: null, errorMessage: MESSAGES.tryAgain, successMessage: null };
  }

  const { firstName: fn, lastName: ln, phone: ph } = validated.data;
  const result = await updateUserProfileService(jwt, profile.id, {
    firstName: fn,
    lastName: ln,
    phone: ph,
  });

  if (!result) {
    return {
      ...prevState,
      zodErrors: null,
      errorMessage: MESSAGES.profileSaveFailed,
      successMessage: null,
    };
  }

  revalidatePath("/profile");
  return {
    ...prevState,
    zodErrors: null,
    errorMessage: null,
    successMessage: MESSAGES.profileSaveSuccess,
  };
}

export async function toggleNewsletterSubscriptionAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  if (!jwt) redirect("/login");

  const subscribe = formData.get("subscribe") === "true";
  const method = subscribe ? "POST" : "DELETE";
  const url = new URL("/api/newsletter-signups/me", STRAPI_URL);

  try {
    const response = await fetch(url.href, {
      method,
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!response.ok) throw new Error("Request failed");
  } catch {
    return {
      ...prevState,
      subscribed: !subscribe,
      errorMessage: MESSAGES.newsletterToggleFailed,
      successMessage: null,
    };
  }

  revalidatePath("/profile");
  return {
    subscribed: subscribe,
    errorMessage: null,
    successMessage: subscribe
      ? MESSAGES.newsletterSubscribeSuccess
      : MESSAGES.newsletterUnsubscribeSuccess,
  };
}
