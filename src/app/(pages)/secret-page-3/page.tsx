"use client";

import { useState, useEffect } from "react";

export default function SecretPage3() {
  const [friendEmail, setFriendEmail] = useState("");
  interface FriendRequest {
    user_id: string;
    users: {
      email: string;
    };
  }
  interface FriendWithMessage {
    content: string;
    users: {
      email: string;
    };
  }

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsWithMessages, setFriendsWithMessages] = useState<
    FriendWithMessage[]
  >([]);
  const [error, setError] = useState("");

  async function fetchFriendRequests() {
    const response = await fetch("/api/friend-requests", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.friendRequests) {
      setFriendRequests(data.friendRequests);
    } else if (data.error) {
      setError(data.error);
    }
  }

  async function fetchFriendsWithMessages() {
    const response = await fetch("/api/friends-with-messages", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.messages) {
      setFriendsWithMessages(data.messages);
    } else if (data.error) {
      setError(data.error);
    }
  }

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendsWithMessages();
  }, []);

  const handleAddFriend = async () => {
    const response = await fetch("/api/add-friend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: friendEmail }),
    });

    const data = await response.json();
    if (data.message) {
      alert("Friend added!");
      fetchFriendRequests();
    } else if (data.error) {
      alert(`Error: ${data.error}`);
    }
  };

  const handleAcceptFriend = async (friendId: string) => {
    const response = await fetch("/api/accept-friend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });

    const data = await response.json();
    if (data.message) {
      alert("Friend request accepted!");
      fetchFriendRequests();
      fetchFriendsWithMessages();
    } else if (data.error) {
      setError(data.error);
    }
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
      <h2>Friend Requests</h2>
      {friendRequests.length > 0 ? (
        <ul>
          {friendRequests.map((request) => (
            <li key={request.user_id}>
              {request.users.email}
              <button onClick={() => handleAcceptFriend(request.user_id)}>
                Accept
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friend requests</p>
      )}
      <h2>Friends and Their Secret Messages</h2>
      {friendsWithMessages.length > 0 ? (
        <ul>
          {friendsWithMessages.map((friend) => (
            <li key={friend.users.email}>
              {friend.users.email}: {friend.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends with secret messages</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
