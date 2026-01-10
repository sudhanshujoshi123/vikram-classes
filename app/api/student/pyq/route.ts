// /api/student/pyq/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const medium = searchParams.get("medium");
  const classNum = searchParams.get("class");
  const subject = searchParams.get("subject");

  if (!medium || !classNum || !subject) {
    return NextResponse.json({ pyq: [] });
  }

  const result = await pool.query(
    `SELECT medium, class, subject, pdf_url
     FROM pyq
     WHERE medium=$1 AND class=$2 AND subject=$3`,
    [medium, classNum, subject]
  );

  return NextResponse.json({ pyq: result.rows });
}
