import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: false, // Desabilitar email/password, usar apenas OAuth
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!].filter(Boolean),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  user: {
    additionalFields: {
      credits: {
        type: "number",
        defaultValue: 0,
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
