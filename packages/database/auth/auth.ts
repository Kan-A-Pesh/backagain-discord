import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database";
import { getBaseUrl } from "./utils";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: getBaseUrl(),
  trustedOrigins: [getBaseUrl()],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
