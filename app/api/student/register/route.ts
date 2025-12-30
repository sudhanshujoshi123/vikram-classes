export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, student_class } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO students (name, email, password, student_class)
      VALUES ($1,$2,$3,$4)
      `,
      [name, email, hashedPassword, student_class]
    );

    return NextResponse.json({ message: "Student registered successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
