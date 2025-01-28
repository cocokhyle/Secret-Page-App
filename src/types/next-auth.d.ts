// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Add the `id` property here
  }

  interface Session {
    user: User;
  }
}
