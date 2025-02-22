"use client";

import { useState, useEffect } from "react";
import SecretPage1 from "@/components/secret-page-1/secret-page-1";

export default function SecretPage2() {
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch the existing secret message on component mount
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

  // Handle saving or overwriting the secret message
  const handleSaveMessage = async () => {
    const response = await fetch("/api/insert-secret-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });

    const data = await response.json();
    if (data.message) {
      // Update the UI to show the new or updated secret message
      setSecretMessage(newMessage);
      setNewMessage(""); // Clear input after saving
      alert("Message saved successfully!");
    }
  };

  // Handle updating the existing secret message
  const handleUpdateMessage = async () => {
    const response = await fetch("/api/update-secret-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });

    const data = await response.json();
    if (data.message) {
      // Update the UI to show the updated secret message
      setSecretMessage(newMessage);
      setNewMessage(""); // Clear input after updating
      alert("Message updated successfully!");
    } else if (data.error) {
      setError(data.error);
    }
  };

  return (
    <div>
      <SecretPage1 hideSecret={true} />

      <div className="flex justify-center items-center pt-10">
        <div className="flex flex-col gap-5 py-5 px-5 justify-center items-center w-fit  border border-gray-200  rounded-lg">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <h1 className="font-bold w-full items-start">Secret Message</h1>
          <div className="flex justify-center items-center gap-3">
            <textarea
              className="w-[300px] h-[50px] border border-gray-300 rounded-lg p-2"
              placeholder="Enter new secret message"
              value={newMessage || secretMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            {secretMessage && (
              <button
                className="px-5 py-2 w-fit text-white bg-blue-700 rounded-lg"
                onClick={handleUpdateMessage}
              >
                Update
              </button>
            )}
            {!secretMessage && (
              <button
                className="px-5 py-2 w-fit text-white bg-blue-700 rounded-lg"
                onClick={handleSaveMessage}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
