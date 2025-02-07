import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth/authOptions";

// Get the secret message for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Fix: Ensure only one message is returned by the query
  const { data, error } = await supabase
    .from("messages")
    .select("content")
    .eq("user_id", userId)
    .single(); // Ensure single row is returned

  if (error) {
    console.error("Failed to fetch secret message:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch secret message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: data?.content || "" }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { content } = await req.json();

  // First, try to get the existing secret message
  const { data: existingMessage, error: fetchError } = await supabase
    .from("messages")
    .select("id, content")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to fetch existing message:", fetchError.message);
    return NextResponse.json(
      { error: "Failed to fetch secret message" },
      { status: 500 }
    );
  }

  if (existingMessage) {
    // If a message already exists for the user, update it
    const { error: updateError } = await supabase
      .from("messages")
      .update({ content })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Failed to update secret message:", updateError.message);
      return NextResponse.json(
        { error: "Failed to update secret message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Secret message updated successfully" },
      { status: 200 }
    );
  } else {
    // If no message exists, insert a new one
    const { error: insertError } = await supabase
      .from("messages")
      .insert([{ user_id: userId, content }]);

    if (insertError) {
      console.error("Failed to save secret message:", insertError.message);
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
}
