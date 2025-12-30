import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { classNum, subject, book_name } = await req.json();

  await pool.query(
    "INSERT INTO notes_book (class, subject, book_name) VALUES ($1,$2,$3)",
    [classNum, subject, book_name]
  );

  return NextResponse.json({ message: "Book added" });
}
