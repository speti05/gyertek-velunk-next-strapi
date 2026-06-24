const BASE_URL = process.env.STRAPI_API_URL ?? "http://localhost:1337";

export async function subscribeService(email: string) {
  const url = new URL("/api/newsletter-signups", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          email,
        },
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Subscribe Service Error:", error);
  }
}

export interface CompanionPayload {
  lastName: string;
  firstName: string;
  phone: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
}

export interface EventsSubscribeProps {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  billingCountry: string;
  billingCity: string;
  billingZip: string;
  billingStreet: string;
  billingHouseNumber: string;
  wantInvoice: boolean;
  companyName: string;
  taxNumber: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
  companions: CompanionPayload[];
  notes: string;
  event: { connect: string[] };
}

export interface ContactRequestProps {
  name: string;
  phone?: string;
  email?: string;
  preferredContact: "phone" | "email";
}

export async function contactRequestService(data: ContactRequestProps) {
  const url = new URL("/api/contact-requests", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    return await response.json();
  } catch (error) {
    console.error("Contact Request Service Error:", error);
  }
}

export async function eventsSubscribeService(jwt: string, data: EventsSubscribeProps) {
  const url = new URL("/api/event-signups", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: { ...data } }),
    });

    return await response.json();
  } catch (error) {
    console.error("Events Subscribe Service Error:", error);
  }
}
