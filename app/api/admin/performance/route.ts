import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { student_id, test_name, marks, max_marks, remarks } =
      await req.json();

    if (!student_id || !test_name || marks == null || max_marks == null) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO performance
       (student_id, test_name, marks, max_marks, remarks)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, test_name, marks, max_marks, remarks || null]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('ADMIN PERFORMANCE ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
