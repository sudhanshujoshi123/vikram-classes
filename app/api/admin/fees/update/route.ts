export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { student_id, amount, month } = await req.json();

    if (!student_id || !amount) {
      return NextResponse.json(
        { error: "student_id and amount required" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO student_fees (student_id, amount, month)
      VALUES ($1, $2, $3)
      `,
      [student_id, amount, month || null]
    );

    return NextResponse.json(
      { message: "Fees added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("FEES API ERROR:", error.message);

    return NextResponse.json(
      { error: error.message || "Fees insert failed" },
      { status: 500 }
    );
  }
}
