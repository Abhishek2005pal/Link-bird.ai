import { createAuthClient } from 'better-auth/react';

// Check if the environment variable is set
if (!process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
  console.warn('Warning: NEXT_PUBLIC_BETTER_AUTH_URL is not set. Using default: http://localhost:3000');
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
})

export const { 
  useSession, 
  signIn, 
  signOut, 
  signUp 
} = authClient

// Helper function to get the session on the server side
export const getSession = authClient.getSession