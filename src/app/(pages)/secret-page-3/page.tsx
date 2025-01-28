"use client";

import { useState } from "react";

export default function SecretPage3() {
  const [friendEmail, setFriendEmail] = useState("");

  const handleAddFriend = async () => {
    await fetch("/api/add-friend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: friendEmail }),
    });
    alert("Friend added!");
  };

  return (
    <div>
      <h1>Secret Page 3</h1>
      <input
        type="email"
        placeholder="Enter friend's email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
      />
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  );
}
