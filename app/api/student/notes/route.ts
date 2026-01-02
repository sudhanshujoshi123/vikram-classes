import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const medium = searchParams.get("medium");
    const classNum = searchParams.get("class");
    const subject = searchParams.get("subject");

    if (!medium || !classNum || !subject) {
      return NextResponse.json(
        { notes: [] },
        { status: 200 }
      );
    }

    const result = await pool.query(
      `
      SELECT chapter_name, pdf_url
      FROM notes
      WHERE medium = $1
        AND class = $2
        AND subject = $3
      ORDER BY created_at DESC
      `,
      [medium, classNum, subject]
    );

    return NextResponse.json({ notes: result.rows });

  } catch (err) {
    console.error("STUDENT NOTES ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load notes" },
      { status: 500 }
    );
  }
}
