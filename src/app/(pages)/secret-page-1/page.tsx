"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUserCog } from "react-icons/fa";

interface SecretPage1Props {
  hideSecret: boolean;
}

export default function SecretPage1({ hideSecret }: SecretPage1Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        <div className="flex gap-10 justify-center items-center font-medium">
          <div className="hover:text-blue-600">
            <Link href="/secret-page-1">Page 1</Link>
          </div>
          <div className="hover:text-blue-600 font-medium">
            <Link href="/secret-page-2">Page 2</Link>
          </div>
          <div className="hover:text-blue-600 font-medium">
            <Link href="/secret-page-3">Page 3</Link>
          </div>
          <div className="relative">
            <button
              className=" w-fit hover:text-gray-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCog size={30} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-5 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!hideSecret && (
        <div className="w-full flex items-center justify-center py-20">
          <div className="px-10 py-10 gap-5 flex flex-col bg-white  rounded-lg border border-gray-200">
            <h1 className="w-full text-center font-bold">Secret Message</h1>
            {secretMessage ? (
              <h1>{secretMessage}</h1>
            ) : (
              <h1>No secret message available.</h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
