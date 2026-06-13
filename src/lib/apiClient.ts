const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const isDev = import.meta.env.DEV;

// Safe helper to determine if we should fall back to mock data in development
export async function safeRequest<T>(
  path: string,
  options: RequestInit = {},
  fallbackFn: () => Promise<T> | T
): Promise<T> {
  // If in production, we NEVER fall back
  if (!isDev) {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Request failed with status ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data ?? resJson;
  }

  // In development: try calling the backend first
  try {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // If response status is unauthorized (401), don't fallback to mock, let frontend handle it
    if (response.status === 401) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Unauthorized');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Request failed with status ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data ?? resJson;
  } catch (error: any) {
    // If it's a network/connection error (failed to fetch), we fall back to mock data
    if (
      error.message === 'Failed to fetch' || 
      error.name === 'TypeError' ||
      error.message.includes('NetworkError')
    ) {
      console.warn(`⚠️ Backend offline. Falling back to local mock data for path: ${path}`);
      return await fallbackFn();
    }
    // For other errors (like validation or explicit server rejections), throw normally
    throw error;
  }
}
