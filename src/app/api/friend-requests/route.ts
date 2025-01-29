import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Fetch the list of friend requests where the current user is the friend_id
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      user_id,
      users:user_id (
        email
      )
    `
    )
    .eq("friend_id", userId)
    .eq("status", "pending");

  //   console.log("Fetched friend requests:", data);

  if (error) {
    console.error("Failed to fetch friend requests:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }

  return NextResponse.json({ friendRequests: data }, { status: 200 });
}
