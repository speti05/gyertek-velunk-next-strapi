"use server";
import { z } from "zod";
import { subscribeService, eventsSubscribeService, type EventsSubscribeProps } from "./services";

const MESSAGES = {
  emailInvalid: "Érvényes email címet adj meg",
  invalidFirstName: "Add meg a keresztneved",
  invalidLastName: "Add meg a vezetékneved",
  invalidTelephone: "Érvényes telefonszámot adj meg. ",
  enterPhoneNumber: "Add meg a telefonszámod. ",
  someThingWentWrong: "Hiba történt. Kérjük, próbáld újra később.",
  failedToSubscribe: "Sikertelen feliratkozás.",
  succesfullySubscribed: "Sikeres feliratkozás!",
};

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
    console.log(responseData.error, "from action")
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
    .regex(/^(\+\d{1,3}[-.]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
      message: MESSAGES.invalidTelephone,
    }),
});


export async function eventsSubscribeAction(prevState: any, formData: FormData) {
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
    ...validatedFields.data,
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
      errorMessage: MESSAGES.failedToSubscribe,

    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    formData: null,
    successMessage: MESSAGES.succesfullySubscribed,
  };
}
