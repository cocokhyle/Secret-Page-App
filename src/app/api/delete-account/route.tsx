import { NextResponse } from "next/server";
import { supabaseRoleKey } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth/authOptions";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Delete the user from the Supabase `users` table
  const { error } = await supabaseRoleKey
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Failed to delete user:", error.message);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Account deleted successfully" },
    { status: 200 }
  );
}
