import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
import { SignJWT, jwtVerify } from "jose";

function getSecretKey(secret: string | string[] | undefined): string {
  if (!secret) {
    throw new Error("AUTH_SECRET is required");
  }
  return Array.isArray(secret) ? secret[0] : secret;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Github, Google],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    async encode({ token, secret }) {
      try {
        const secretKey = getSecretKey(secret);
        const encodedSecret = new TextEncoder().encode(secretKey);

        // eslint-disable-next-line
        const jwt = await new SignJWT(token as Record<string, any>)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("30d")
          .sign(encodedSecret);

        return jwt;
      } catch (error) {
        console.error("JWT encode error:", error);
        throw error;
      }
    },
    async decode({ token, secret }) {
      try {
        if (!token) {
          return null;
        }

        const secretKey = getSecretKey(secret);
        const encodedSecret = new TextEncoder().encode(secretKey);

        const { payload } = await jwtVerify(token, encodedSecret);

        // eslint-disable-next-line
        return payload as any;
      } catch (error) {
        console.error("JWT decode error:", error);
        return null;
      }
    },
  },
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      token.aud = process.env.AUTH_URL;
      token.iss = process.env.AUTH_URL;
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
