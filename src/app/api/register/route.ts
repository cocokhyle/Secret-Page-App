import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert user into the database
    const { data, error } = await supabase
      .from("users")
      .insert({ email, password: hashedPassword });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
