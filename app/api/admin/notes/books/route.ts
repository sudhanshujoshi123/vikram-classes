import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classNum = searchParams.get("class");
    const subject = searchParams.get("subject");

    if (!classNum || !subject) {
      return NextResponse.json({ books: [] });
    }

    const result = await pool.query(
      `SELECT * FROM notes_books 
       WHERE class = $1 AND subject = $2
       ORDER BY id ASC`,
      [classNum, subject]
    );

    return NextResponse.json({ books: result.rows });
  } catch (error) {
    console.error("Books API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
