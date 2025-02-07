import { NextResponse } from "next/server";
import { supabaseRoleKey } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { content } = await req.json();

  // Fetch the existing message to ensure it exists
  const { data: existingMessage, error: fetchError } = await supabaseRoleKey
    .from("messages")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch existing message:", fetchError.message);
    return NextResponse.json(
      { error: "Failed to fetch existing message" },
      { status: 500 }
    );
  }

  if (existingMessage) {
    // Update the secret message for the authenticated user
    const { error: updateError } = await supabaseRoleKey
      .from("messages")
      .update({ content })
      .eq("id", existingMessage.id);

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
    return NextResponse.json(
      { error: "No existing message found to update" },
      { status: 404 }
    );
  }
}
