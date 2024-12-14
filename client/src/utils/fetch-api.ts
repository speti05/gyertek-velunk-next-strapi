type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
}

export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, body, next } = options;

  const headers: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  try {
    const response = await fetch(url, headers);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      if (response.ok) return json;
      // include parsed body for better diagnostics
      return { status: response.status, statusText: response.statusText, body: json };
    } else {
      const text = await response.text();
      if (response.ok) {
        // return raw text for non-JSON successful responses
        return { body: text };
      }
      return { status: response.status, statusText: response.statusText, body: text };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}