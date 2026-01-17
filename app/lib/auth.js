// frontend/lib/auth.js
export async function fetchWithAuth(url, options = {}) {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  // Skip refresh for auth endpoints to prevent loops
  const isAuthEndpoint =
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/refresh');

  let res;
  try {
    res = await fetch(fullUrl, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (fetchErr) {
    // Network-level failure (offline, CORS, etc.)
    throw new Error('Network error: Could not reach the server');
  }

  // Handle 401 → only refresh if not on auth endpoints and we likely have tokens
  if (
    res.status === 401 &&
    !isAuthEndpoint &&
    document.cookie.includes('refreshToken=')
  ) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        // Retry original request
        return fetchWithAuth(url, options);
      }

      throw new Error('Session expired. Please log in again.');
    } catch (refreshErr) {
      throw new Error('Session expired. Please log in again.');
    }
  }

  // For all other responses
  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;

    try {
      // Safely try to parse JSON error
      const data = await res.json();
      // Prefer backend's error message if it exists
      errorMessage = data.error || errorMessage;
    } catch (jsonErr) {
      // JSON parsing failed → use status-based fallback
      if (res.status === 400) {
        errorMessage = 'Invalid input – check your details';
      } else if (res.status === 401) {
        errorMessage = 'Unauthorized – invalid credentials';
      } else if (res.status === 500) {
        errorMessage = 'Server error – please try again later';
      }
    }

    throw new Error(errorMessage);
  }

  return res;
}

// Get current user (unchanged)
export async function getUser() {
  try {
    const res = await fetchWithAuth('/me');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}