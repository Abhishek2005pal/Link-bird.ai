import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import * as schema from "./db/schema"

// Check for required environment variables and log warnings
const requiredEnvVars = [
  { key: 'GOOGLE_CLIENT_ID', value: process.env.GOOGLE_CLIENT_ID },
  { key: 'GOOGLE_CLIENT_SECRET', value: process.env.GOOGLE_CLIENT_SECRET },
  { key: 'BETTER_AUTH_SECRET', value: process.env.BETTER_AUTH_SECRET },
  { key: 'BETTER_AUTH_URL', value: process.env.BETTER_AUTH_URL }
];

requiredEnvVars.forEach(({ key, value }) => {
  if (!value) {
    console.warn(`Warning: Environment variable ${key} is not set. Authentication may not work properly.`);
  }
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    }
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-do-not-use-in-production',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
})