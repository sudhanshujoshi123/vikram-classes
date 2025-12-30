import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) return NextResponse.json({ performance: [] });

    const token = auth.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 🔥 SUPPORT BOTH CASES
    const studentId = decoded.id || decoded.userId || decoded.student_id;

    if (!studentId) {
      console.log('❌ studentId missing in token');
      return NextResponse.json({ performance: [] });
    }

    const result = await pool.query(
      'SELECT * FROM performance WHERE student_id = $1 ORDER BY created_at DESC',
      [studentId]
    );

    return NextResponse.json({ performance: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ performance: [] });
  }
}
