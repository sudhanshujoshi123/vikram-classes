import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();

  const medium = formData.get("medium");
  const cls = formData.get("class");
  const subject = formData.get("subject");
  const file = formData.get("pdf") as File;

  if (!file) {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "pyq",
        resource_type: "raw", // IMPORTANT for PDF
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });

  await pool.query(
    `INSERT INTO pyq (medium, class, subject, pdf_url)
     VALUES ($1,$2,$3,$4)`,
    [medium, cls, subject, upload.secure_url]
  );

  return NextResponse.json({ success: true });
}
