import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        nb.class,
        nb.subject,
        nb.book_name,
        nc.chapter_name,
        nc.pdf_url
      FROM notes_books nb
      JOIN notes_chapters nc ON nc.book_id = nb.id
      ORDER BY nb.class, nb.book_name, nc.created_at DESC
    `);

    return NextResponse.json({
      notes: result.rows
    });
  } catch (err) {
    console.error("Student notes error:", err);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
