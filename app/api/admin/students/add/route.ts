import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, student_class, email, password } = await req.json();

    if (!name || !student_class || !email || !password) {
      return NextResponse.json(
        { error: "Sab fields required hai" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO students (vc_id, name, student_class, email, password)
      VALUES (
        'VC' || LPAD((SELECT COALESCE(MAX(id),0)+1 FROM students)::TEXT, 2, '0'),
        $1,
        $2,
        $3,
        $4
      )
      RETURNING id, vc_id, name, email, student_class;
      `,
      [name, student_class, email, password]
    );

    return NextResponse.json({ student: result.rows[0] });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
