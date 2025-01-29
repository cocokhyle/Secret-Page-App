import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { email } = await req.json();

  // Fetch the user_id based on the email
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (fetchError) {
    console.error("Failed to fetch user:", fetchError.message);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }

  const friendId = user.id;

  // Insert a new friend relationship
  const { error: insertError } = await supabase
    .from("friends")
    .insert([{ user_id: userId, friend_id: friendId }]);

  if (insertError) {
    console.error("Failed to add friend:", insertError.message);
    return NextResponse.json(
      { error: "Failed to add friend" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Added friend successfully" },
    { status: 200 }
  );
}
