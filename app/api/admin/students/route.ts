export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.student_class,
        (
          SELECT COALESCE(SUM(amount), 0)
          FROM student_fees
          WHERE student_id = s.id
        ) AS total_paid
      FROM students s
      ORDER BY s.id
    `);

    return NextResponse.json({ students: result.rows });
  } catch (err: any) {
    console.error("ERROR:", err.message);
    return NextResponse.json(
      { error: "Students fetch failed" },
      { status: 500 }
    );
  }
}
