"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { subscribeService, eventsSubscribeService } from "./services";
import { getUserProfileService } from "./auth-service";
import { MESSAGES } from "@/utils/texts";
import { isDev } from "@clientRoot/env";

const subscribeSchema = z.object({
  email: z.string().email({
    message: MESSAGES.emailInvalid,
  }),
});

export async function subscribeAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.recaptchaFailed,
    };
  }

  const email = formData.get("email");

  const validatedFields = subscribeSchema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
    };
  }

  const responseData = await subscribeService(validatedFields.data.email);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: MESSAGES.someThingWentWrong,
    };
  }

  if (responseData.error) {
    const isAlreadySubscribed =
      responseData.error.details?.errors?.some((e: any) =>
        e.message?.toLowerCase().includes("unique")
      ) || responseData.error.message?.toLowerCase().includes("unique");
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      errorMessage: isAlreadySubscribed
        ? MESSAGES.emailAlreadySubscribed
        : MESSAGES.failedToSubscribe,
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: MESSAGES.succesfullySubscribed,
  };
}

async function verifyRecaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (isDev || !secret) return true;
  if (!token) return false;
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

export async function eventsSubscribeAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.recaptchaFailed,
    };
  }

  const eventId = formData.get("eventId") as string;
  if (!eventId) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.someThingWentWrong,
    };
  }

  // Get JWT from cookie
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  if (!jwt) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.loginRequired,
    };
  }

  // Get user profile
  const userProfile = await getUserProfileService(jwt);
  if (!userProfile) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.loginRequired,
    };
  }

  if (!userProfile.firstName || !userProfile.lastName || !userProfile.phone) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.missingProfileData,
    };
  }

  const responseData = await eventsSubscribeService(jwt, {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    telephone: userProfile.phone,
    event: { connect: [eventId] },
  });

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: MESSAGES.someThingWentWrong,
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      errorMessage: MESSAGES.failedToSubscribeToEvent,
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: MESSAGES.succesfullySubscribedToEvent,
  };
}
