"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SecretPage1() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <p>Secret Message: Only logged-in users can see this!</p>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
}
