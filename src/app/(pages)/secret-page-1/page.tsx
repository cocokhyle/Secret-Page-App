"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SecretPage1() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [secretMessage, setSecretMessage] = useState<string>("");

  useEffect(() => {
    async function fetchSecretMessage() {
      const response = await fetch("/api/secret-message", {
        method: "GET",
      });
      const data = await response.json();
      if (data.message) setSecretMessage(data.message);
    }

    fetchSecretMessage();
  }, []);

  // Redirect unauthenticated users
  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/");
    return null;
  }

  const handleDeleteAccount = async () => {
    const res = await fetch("/api/delete-account", { method: "DELETE" });
    if (res.ok) {
      signOut();
      router.push("/");
    } else {
      alert("Failed to delete account");
    }
  };

  return (
    <div>
      <h1>Welcome to Secret Page 1</h1>
      <p>{secretMessage}</p>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
}
