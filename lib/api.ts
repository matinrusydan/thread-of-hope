/**
 * Get the base URL for API calls
 * Works in both server and client environments
 */
export function getApiBaseUrl(): string {
  // Server-side: use environment variables
  if (typeof window === 'undefined') {
    // In production, use the deployment URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    // In development, use localhost
    return process.env.NEXTAUTH_URL || 'http://localhost:3000'
  }

  // Client-side: use window.location
  return window.location.origin
}

/**
 * Build a full API URL
 * @param path - API path (e.g., '/api/gallery')
 * @returns Full API URL
 */
export function apiUrl(path: string): string {
  const baseUrl = getApiBaseUrl()
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Fetch wrapper that automatically uses the correct base URL
 * @param path - API path
 * @param options - Fetch options
 * @returns Fetch response
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = apiUrl(path)
  return fetch(url, options)
}