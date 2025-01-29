"use client";

import { useState, useEffect } from "react";

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
    } else if (data.error) {
      setError(data.error);
    }
  };

  return (
    <div>
      <h1>Secret Page 2</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
      <button onClick={handleUpdateMessage}>Update Secret Message</button>
    </div>
  );
}
