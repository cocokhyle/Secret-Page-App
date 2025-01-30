"use client";

import { useState, useEffect } from "react";
import { LuCircleUser } from "react-icons/lu";
import SecretPage2 from "../secret-page-2/page";

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
      alert(`User not found!`);
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
    <div className="flex flex-col gap-5">
      <SecretPage2 />
      <div className="flex justify-center items-center">
        <div className=" flex flex-col w-fit justify-center items-center gap-5 border border-gray-200 px-10 py-10 rounded-lg">
          <div className="flex gap-5 w-full">
            <input
              className="p-2 border border-gray-300 rounded-md w-full h-10"
              type="email"
              placeholder="Enter friend's email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button
              className="py-2 px-3 bg-blue-700 hover:bg-blue-800 rounded-lg text-white h-10 w-36"
              onClick={handleAddFriend}
            >
              Add Friend
            </button>
          </div>
          <div className="w-fit  flex flex-col gap-5">
            <div className=" border border-gray-200 rounded-lg  px-10 py-10 flex flex-col gap-5">
              <h2 className="font-semibold">Friend Requests</h2>
              <div className="">
                {friendRequests.length > 0 ? (
                  <ul>
                    {friendRequests.map((request) => (
                      <li className="" key={request.user_id}>
                        <div className="px-5 py-2 flex gap-5 border border-gray-200 mb-2 justify-between rounded-lg">
                          <h1 className="font-medium">{request.users.email}</h1>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleAcceptFriend(request.user_id)}
                          >
                            Accept
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No friend requests</p>
                )}
              </div>
            </div>
            <div className=" border border-gray-200 rounded-lg  px-10 py-10 flex flex-col gap-5">
              <h2 className="font-semibold">Friends Secret Messages</h2>
              <div className="">
                {friendsWithMessages.length > 0 ? (
                  <ul>
                    {friendsWithMessages.map((friend) => (
                      <li key={friend.users.email} className="mb-3">
                        <div className="flex flex-col gap-5 border border-gray-200 px-5 py-5 rounded-lg">
                          <div className="flex gap-1 items-center">
                            <LuCircleUser />
                            <h1 className="font-medium">
                              {friend.users.email}
                            </h1>
                          </div>
                          <div className="border border-gray-600 h-[1px]"></div>
                          <p className="font-thin">{friend.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No friends with secret messages</p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
