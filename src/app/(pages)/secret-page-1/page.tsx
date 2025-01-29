"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SecretPage1Props {
  hideLinkButton: boolean;
}

export default function SecretPage1({ hideLinkButton }: SecretPage1Props) {
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

  if (!session) {
    return null;
  }
  const username = session.user.email?.split("@")[0];

  return (
    <div>
      <div className="flex justify-between py-5 px-10 shadow-md items-center">
        <h1 className="font-bold ">Welcome back {username}!</h1>

        <div className="flex gap-5">
          <button
            className="px-5 py-2 w-fit text-white bg-blue-700 rounded-lg"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
          <button
            className="px-5 py-2 w-fit text-white bg-red-700 rounded-lg"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
      {!hideLinkButton && (
        <div className="w-full flex items-center justify-center py-20">
          <Link
            className="px-5 py-2 w-fit text-white bg-blue-700 rounded-lg"
            href="/secret-page-2"
          >
            View Secret Messages
          </Link>
        </div>
      )}
    </div>
  );
}
