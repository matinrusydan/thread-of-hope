import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for API calls
 * Automatically detects environment and returns appropriate URL
 *
 * @returns {string} The base URL for the application
 */
export function getBaseUrl(): string {
  // Check if we're in production (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Check for custom NEXTAUTH_URL (for production deployments)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // Production fallback (should not reach here in properly configured apps)
  return 'http://localhost:3000'
}

/**
 * Get full API URL for a given endpoint
 *
 * @param endpoint - The API endpoint (e.g., '/api/events')
 * @returns {string} The full API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl()
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

/**
 * Environment detection helpers
 */
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isVercel = !!process.env.VERCEL_URL

/**
 * Safe environment variable access
 */
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is not set`)
  }
  return value || defaultValue!
}
