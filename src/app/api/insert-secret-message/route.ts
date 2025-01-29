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
  const { content } = await req.json();

  // Insert a new secret message for the user
  const { error } = await supabase
    .from("messages")
    .insert([{ user_id: userId, content }]);

  if (error) {
    console.error("Failed to save secret message:", error.message);
    return NextResponse.json(
      { error: "Failed to save secret message" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Secret message saved successfully" },
    { status: 200 }
  );
}
