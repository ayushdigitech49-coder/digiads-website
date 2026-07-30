// Base API configuration abstraction
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.sumitdigitech.com/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    // In MVP frontend mode, errors fallback gracefully to local data
    console.warn(`[API Abstraction] Fallback to local mock data for: ${endpoint}`, error);
    throw error;
  }
}
