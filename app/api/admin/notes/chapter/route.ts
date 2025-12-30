import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const book_id = data.get("book_id");
  const chapter_name = data.get("chapter_name");
  const file: any = data.get("file");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const filePath = `/uploads/${Date.now()}-${file.name}`;
  fs.writeFileSync(path.join(process.cwd(), "public", filePath), buffer);

  await pool.query(
    "INSERT INTO notes_chapter (book_id, chapter_name, file_url) VALUES ($1,$2,$3)",
    [book_id, chapter_name, filePath]
  );

  return NextResponse.json({ message: "Chapter uploaded" });
}
