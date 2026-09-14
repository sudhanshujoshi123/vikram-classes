import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const medium = searchParams.get("medium");  // Optional
    const classNum = searchParams.get("class");
    const subject = searchParams.get("subject");

    // Sirf class aur subject required hai
    if (!classNum || !subject) {
      return NextResponse.json({ practicals: [] });
    }

    // Medium optional - agar hai toh use karo, nahi toh sab practicals dikhao
    let query = `
      SELECT id, medium, class, subject, pdf_url
      FROM practical
      WHERE class = $1 AND subject = $2
    `;
    
    const params: any[] = [classNum, subject];

    // Agar medium provide kiya hai, toh filter lagao
    if (medium) {
      query += ` AND medium = $3`;
      params.push(medium);
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, params);

    console.log('✅ Practicals found:', result.rows.length);

    return NextResponse.json({ practicals: result.rows });

  } catch (err) {
    console.error("PRACTICAL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load practicals" },
      { status: 500 }
    );
  }
}