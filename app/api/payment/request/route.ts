import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { studentId, className, chapterId, utrNumber, amount } = await request.json();

    console.log('💰 Payment Request:', { studentId, className, chapterId, utrNumber, amount });

    if (!studentId || !className || !chapterId || !utrNumber || !amount) {
      console.error('❌ Missing fields');
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if UTR already used
    const existingPayment = await pool.query(
      'SELECT * FROM payments WHERE utr_number = $1',
      [utrNumber]
    );

    if (existingPayment.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This UTR number is already used' },
        { status: 400 }
      );
    }

    // Check if already has subscription for this chapter
    const existingSub = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE student_id = $1 
       AND class_name = $2 
       AND chapter_id = $3
       AND is_active = true
       AND expires_at > NOW()`,
      [studentId, className, chapterId]
    );

    if (existingSub.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You already have access to this chapter' },
        { status: 400 }
      );
    }

    // Create payment request
    const paymentResult = await pool.query(
      `INSERT INTO payments (student_id, class_name, chapter_id, utr_number, amount, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [studentId, className, chapterId, utrNumber, amount]
    );

    console.log('✅ Payment created:', paymentResult.rows[0]);

    return NextResponse.json({
      success: true,
      message: 'Payment request submitted successfully. Admin will verify soon.',
      payment: paymentResult.rows[0]
    });

  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit payment request' },
      { status: 500 }
    );
  }
}