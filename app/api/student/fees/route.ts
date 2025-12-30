import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req: Request) {
  try {
    /* ===== TOKEN ===== */
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const student_id = decoded.id;

    /* ===== TOTAL FEES ===== */
    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_fees
       FROM student_fees
       WHERE student_id = $1`,
      [student_id]
    );

    /* ===== MONTH WISE FEES (TEXT SAFE) ===== */
    const monthlyResult = await pool.query(
      `SELECT 
         month,
         amount
       FROM student_fees
       WHERE student_id = $1
       ORDER BY month`,
      [student_id]
    );

    return NextResponse.json({
      total_fees: Number(totalResult.rows[0].total_fees),
      monthly_fees: monthlyResult.rows.map(r => ({
        month: r.month,          // '2024-05'
        amount: Number(r.amount)
      })),
    });

  } catch (err) {
    console.error('FEES API ERROR:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
