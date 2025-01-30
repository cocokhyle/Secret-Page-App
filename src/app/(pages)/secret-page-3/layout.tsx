"use client";

import { SessionProvider } from "next-auth/react";

export default function SecretPage1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <section>
        {/* Shared UI for Secret Page 1 can go here */}
        {children}
      </section>
    </SessionProvider>
  );
}
