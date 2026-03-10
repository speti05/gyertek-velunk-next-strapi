"use server";
import { z } from "zod";
import { subscribeService, eventsSubscribeService, type EventsSubscribeProps } from "./services";
import { MESSAGES } from "@/utils/texts";

const subscribeSchema = z.object({
  email: z.string().email({
    message: MESSAGES.emailInvalid,
  }),
});

export async function subscribeAction(prevState: any, formData: FormData) {
  const email = formData.get("email");

  const validatedFields = subscribeSchema.safeParse({
    email: email
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
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      errorMessage: MESSAGES.failedToSubscribe,
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
const phoneRegex = /^(\+36|06)\d{9}$/;

const eventsSubscribeSchema = z.object({
  firstName: z.string().min(1, {
    message: MESSAGES.invalidFirstName,
  }),
  lastName: z.string().min(1, {
    message: MESSAGES.invalidLastName,
  }),
  email: z.string().email({
    message: MESSAGES.emailInvalid,
  }),
  telephone: z.string()
    .min(1, { message: MESSAGES.enterPhoneNumber })
    .regex(phoneRegex, {
      message: MESSAGES.invalidTelephone,
    }),
});


async function verifyRecaptcha(token: string): Promise<boolean> {
  // Skip verification in development mode
  if (process.env.NODE_ENV === "development") {
    return true;
  }

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

export async function eventsSubscribeAction(prevState: any, formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: MESSAGES.recaptchaFailed,
    };
  }

  const formDataObject = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    eventId: formData.get("eventId"),
  }

  const validatedFields = eventsSubscribeSchema.safeParse(formDataObject);

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      formData: {
        ...formDataObject,
      },
    };
  }

  const dataToSend: EventsSubscribeProps = {
    ...(validatedFields.data as Required<typeof validatedFields.data>),
    event: {
      connect: [formDataObject.eventId as string],
    },
  };

  const responseData = await eventsSubscribeService(dataToSend);

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
      formData: {
        ...formDataObject,
      },
      errorMessage: MESSAGES.failedToSubscribeToEvent,

    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    formData: null,
    successMessage: MESSAGES.succesfullySubscribedToEvent,
  };
}
