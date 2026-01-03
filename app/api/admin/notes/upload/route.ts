import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const medium = formData.get("medium") as string;
    const classNum = formData.get("class") as string;
    const subject = formData.get("subject") as string;
    const chapter = formData.get("chapter") as string;
    const file = formData.get("pdf") as File;

    if (!medium || !classNum || !subject || !chapter || !file) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // ✔ SAFE
          folder: "notes",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    await pool.query(
      `
      INSERT INTO notes (medium, class, subject, chapter_name, pdf_url)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [medium, classNum, subject, chapter, upload.secure_url]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
