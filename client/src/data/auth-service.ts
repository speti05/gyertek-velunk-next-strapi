const BASE_URL = process.env.STRAPI_API_URL ?? "http://localhost:1337";

export interface AuthResponse {
  jwt?: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

export interface UserProfile {
  id: number;
  documentId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

export async function registerService(
  email: string,
  password: string
): Promise<AuthResponse | null> {
  const url = new URL("/api/auth/local/register", BASE_URL);
  const username = email.split("@")[0];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Register Service Error:", error);
    return null;
  }
}

export async function loginService(email: string, password: string): Promise<AuthResponse | null> {
  const url = new URL("/api/auth/local", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    return null;
  }
}

export async function forgotPasswordService(email: string): Promise<{ ok: boolean } | null> {
  const url = new URL("/api/auth/forgot-password", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return { ok: response.ok };
  } catch (error) {
    console.error("Forgot Password Service Error:", error);
    return null;
  }
}

export async function confirmEmailService(
  confirmationToken: string
): Promise<{ ok: boolean } | null> {
  const url = new URL("/api/auth/email-confirmation", BASE_URL);
  url.searchParams.set("confirmation", confirmationToken);

  try {
    const response = await fetch(url, { method: "GET" });
    return { ok: response.ok };
  } catch (error) {
    console.error("Confirm Email Service Error:", error);
    return null;
  }
}

export async function resetPasswordService(
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse | null> {
  const url = new URL("/api/auth/reset-password", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });
    return await response.json();
  } catch (error) {
    console.error("Reset Password Service Error:", error);
    return null;
  }
}

export async function getUserProfileService(jwt: string): Promise<UserProfile | null> {
  const url = new URL("/api/users/me", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Get User Profile Service Error:", error);
    return null;
  }
}

export async function updateUserProfileService(
  jwt: string,
  userId: number,
  data: { firstName: string; lastName: string; phone: string }
): Promise<UserProfile | null> {
  const url = new URL(`/api/users/${userId}`, BASE_URL);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Update User Profile Service Error:", error);
    return null;
  }
}
