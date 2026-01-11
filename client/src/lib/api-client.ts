const TOKEN_KEY = "auth_token";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// API client with automatic 401 handling
export async function apiClient(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // Handle unauthorized responses globally
  if (response.status === 401) {
    // Dispatch custom event for auth context to handle
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    throw new Error("Session expired. Please sign in again.");
  }

  if (!response.ok) {
    // Try to parse as JSON first
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(
        error.error || `Request failed with status ${response.status}`
      );
    } else {
      // If not JSON, it might be HTML error page
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Check if response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    const text = await response.text();
    console.error("Expected JSON but got:", text.substring(0, 200));
    throw new Error("Server returned non-JSON response");
  }
}
