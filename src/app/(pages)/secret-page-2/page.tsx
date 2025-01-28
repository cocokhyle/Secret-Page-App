"use client";

import { useState, useEffect } from "react";

export default function SecretPage2() {
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");

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
    const response = await fetch("/api/secret-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });

    const data = await response.json();
    if (data.message) {
      // Update the UI to show the new or updated secret message
      setSecretMessage(newMessage);
      setNewMessage(""); // Clear input after saving
    }
  };

  return (
    <div>
      <h1>Secret Page 2</h1>
      <p>
        Your current secret message: {secretMessage || "No secret message set"}
      </p>
      <input
        type="text"
        placeholder="Enter new secret message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSaveMessage}>Save Secret Message</button>
    </div>
  );
}
