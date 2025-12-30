import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // ✅ 1. student find karo
    const result = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const student = result.rows[0];

    // ✅ 2. password compare (MOST IMPORTANT)
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ 3. token generate
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        name: student.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
