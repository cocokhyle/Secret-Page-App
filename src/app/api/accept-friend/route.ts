import { NextResponse } from "next/server";
import { supabaseRoleKey } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { friendId } = await req.json();

  // Fetch the friend request to ensure it exists and is pending
  const { data: friendRequest, error: fetchError } = await supabaseRoleKey
    .from("friends")
    .select("id, status")
    .eq("user_id", friendId) // Request is from the friend (friendId)
    .eq("friend_id", userId) // And user is being added as the friend (userId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch friend request:", fetchError.message);
    return NextResponse.json(
      { error: "Failed to fetch friend request" },
      { status: 500 }
    );
  }

  if (friendRequest.status !== "pending") {
    return NextResponse.json(
      { error: "Friend request is not pending" },
      { status: 400 }
    );
  }

  // Step 1: Update the status of the friend request to "accepted"
  const { error: updateError } = await supabaseRoleKey
    .from("friends")
    .update({ status: "accepted" })
    .eq("id", friendRequest.id);

  if (updateError) {
    console.error("Failed to accept friend request:", updateError.message);
    return NextResponse.json(
      { error: "Failed to accept friend request" },
      { status: 500 }
    );
  }

  // Step 2: Create a new row with reversed user_id and friend_id to confirm the bidirectional relationship
  const { error: insertError } = await supabaseRoleKey.from("friends").insert([
    {
      user_id: userId, // Current user is now the "friend"
      friend_id: friendId, // Friend is now the "user"
      status: "accepted", // Status is accepted now
    },
  ]);

  if (insertError) {
    console.error(
      "Failed to create bidirectional relationship:",
      insertError.message
    );
    return NextResponse.json(
      { error: "Failed to create bidirectional relationship" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message:
        "Friend request accepted and bidirectional relationship established",
    },
    { status: 200 }
  );
}
