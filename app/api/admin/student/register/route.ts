export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, student_class } = body;

    if (!name || !email || !password || !student_class) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO students (name, email, password, student_class)
      VALUES ($1, $2, $3, $4)
      `,
      [name, email, hashedPassword, student_class]
    );

    return NextResponse.json(
      { message: "Student registered successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("REGISTER API ERROR:", error.message);

    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
