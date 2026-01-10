import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const medium = searchParams.get("medium");
    const classNum = searchParams.get("class");
    const subject = searchParams.get("subject");

    if (!medium || !classNum || !subject) {
      return NextResponse.json({ practicals: [] });
    }

    const result = await pool.query(
      `
      SELECT medium, class, subject, pdf_url
      FROM practical
      WHERE medium = $1
        AND class = $2
        AND subject = $3
      ORDER BY id DESC
      `,
      [medium, classNum, subject]
    );

    return NextResponse.json({ practicals: result.rows });

  } catch (err) {
    console.error("PRACTICAL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load practicals" },
      { status: 500 }
    );
  }
}
