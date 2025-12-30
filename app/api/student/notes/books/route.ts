import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classNum = searchParams.get("class");
  const subject = searchParams.get("subject");

  if (!classNum || !subject) {
    return NextResponse.json({ books: [] });
  }

  const result = await pool.query(
    "SELECT id, book_name FROM notes_books WHERE class=$1 AND subject=$2",
    [classNum, subject]
  );

  return NextResponse.json({ books: result.rows });
}
