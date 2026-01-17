// frontend/lib/auth.js
export async function fetchWithAuth(url, options = {}) {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  // Skip refresh for auth endpoints to prevent loops
  const isAuthEndpoint =
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/refresh') ||
    url.includes('/logout');

  try {
    const res = await fetch(fullUrl, {
      ...options,
      credentials: 'include', // This sends cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle 401 → only refresh if not on auth endpoints
    if (res.status === 401 && !isAuthEndpoint) {
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (refreshRes.ok) {
          // Retry original request
          return fetchWithAuth(url, options);
        } else {
          // Refresh failed - clear any stale tokens
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
          });
          throw new Error('Session expired. Please log in again.');
        }
      } catch (refreshErr) {
        throw new Error('Session expired. Please log in again.');
      }
    }

    // For all other responses
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errorMessage = data.error || `Request failed (${res.status})`;
      throw new Error(errorMessage);
    }

    return res;
  } catch (error) {
    if (error.message === 'Network error: Could not reach the server') {
      throw error;
    }
    throw new Error(error.message || 'Request failed');
  }
}

// Get current user
export async function getUser() {
  try {
    const res = await fetchWithAuth('/me');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}