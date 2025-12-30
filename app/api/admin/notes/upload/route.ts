import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const classNum = formData.get("class");
    const subject = formData.get("subject");
    const bookName = formData.get("book_name");
    const chapterName = formData.get("chapter_name");
    const file = formData.get("pdf");

    // 🔴 HARD VALIDATION
    if (
      !classNum ||
      !subject ||
      !bookName ||
      !chapterName ||
      !file ||
      typeof file === "string"
    ) {
      return NextResponse.json(
        { error: "Saari fields bharo" },
        { status: 400 }
      );
    }

    /* ================= SAVE PDF ================= */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const pdfUrl = `/uploads/${fileName}`;

    /* ================= BOOK ================= */
    let bookId: number;

    const bookRes = await pool.query(
      `SELECT id FROM notes_books 
       WHERE class=$1 AND subject=$2 AND book_name=$3`,
      [classNum, subject, bookName]
    );

    if (bookRes.rows.length > 0) {
      bookId = bookRes.rows[0].id;
    } else {
      const insertBook = await pool.query(
        `INSERT INTO notes_books (class, subject, book_name)
         VALUES ($1,$2,$3) RETURNING id`,
        [classNum, subject, bookName]
      );
      bookId = insertBook.rows[0].id;
    }

    /* ================= CHAPTER ================= */
    await pool.query(
      `INSERT INTO notes_chapters (book_id, chapter_name, pdf_url)
       VALUES ($1,$2,$3)`,
      [bookId, chapterName, pdfUrl]
    );

    return NextResponse.json({ message: "Notes uploaded successfully" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
