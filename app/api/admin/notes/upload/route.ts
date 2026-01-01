import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const classNum = formData.get("class") as string;
    const subject = formData.get("subject") as string;
    const medium = formData.get("medium") as string;
    const chapterName = formData.get("chapter_name") as string;
    const file = formData.get("pdf") as File;

    // ✅ VALIDATION
    if (!classNum || !subject || !medium || !chapterName || !file) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ FILE BUFFER
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ CLOUDINARY UPLOAD
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `notes/class-${classNum}/${subject}/${medium}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 👉 yaha future me DB insert karega
    // await prisma.notes.create({...})

    return NextResponse.json({
      success: true,
      message: "Notes uploaded successfully",
      fileUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
