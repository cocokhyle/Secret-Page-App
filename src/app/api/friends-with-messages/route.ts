import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Step 1: Get friend user IDs
  const { data: friends, error: friendsError } = await supabase
    .from("friends")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "accepted");

  if (friendsError) {
    console.error("Failed to fetch friends:", friendsError.message);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }

  // Extract friend user IDs
  const friendUserIds = friends.map((friend) => friend.user_id);

  // If no friends, return empty list
  if (friendUserIds.length === 0) {
    return NextResponse.json({ messages: [] }, { status: 200 });
  }

  // Step 2: Fetch messages from friends
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(
      `
    content,
    users!messages_user_id_fkey ( email )
  `
    )
    .in("user_id", friendUserIds);

  //   console.log(messages);

  if (messagesError) {
    console.error(
      "Failed to fetch messages from friends:",
      messagesError.message
    );
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }

  return NextResponse.json({ messages }, { status: 200 });
}
