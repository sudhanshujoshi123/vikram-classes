import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET - Fetch pending payments
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT p.*, s.name as student_name, s.email, n.chapter_name
       FROM payments p
       JOIN students s ON p.student_id = s.id
       LEFT JOIN notes n ON p.chapter_id = n.id
       WHERE p.status = 'pending'
       ORDER BY p.created_at DESC`
    );

    console.log('📋 Pending payments:', result.rows.length);

    return NextResponse.json({
      success: true,
      payments: result.rows
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payments'
    }, { status: 500 });
  }
}

// POST - Verify payment
export async function POST(request: Request) {
  try {
    const { paymentId, studentId, className, chapterId, action } = await request.json();

    console.log('🔐 Payment Action:', { paymentId, studentId, className, chapterId, action });

    if (action === 'verify') {
      // 1. Update payment status
      await pool.query(
        "UPDATE payments SET status = 'completed', verified_by_admin = true WHERE id = $1",
        [paymentId]
      );

      console.log('✅ Payment status updated to completed');

      // 2. Check if subscription already exists
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
        console.log('⚠️ Subscription already exists, extending...');
        
        // Extend existing subscription
        await pool.query(
          `UPDATE subscriptions 
           SET expires_at = expires_at + INTERVAL '3 months',
               updated_at = NOW()
           WHERE id = $1`,
          [existingSub.rows[0].id]
        );
      } else {
        // 3. Create new subscription
        console.log('📝 Creating new subscription...');
        
        const subResult = await pool.query(
          `INSERT INTO subscriptions (student_id, class_name, chapter_id, expires_at, is_active)
           VALUES ($1, $2, $3, NOW() + INTERVAL '3 months', true)
           RETURNING *`,
          [studentId, className, chapterId]
        );

        console.log('✅ Subscription created:', subResult.rows[0]);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified! Chapter access granted for 3 months.'
      });

    } else if (action === 'reject') {
      await pool.query(
        "UPDATE payments SET status = 'rejected', verified_by_admin = false WHERE id = $1",
        [paymentId]
      );

      return NextResponse.json({
        success: true,
        message: 'Payment rejected'
      });
    }

  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process payment'
    }, { status: 500 });
  }
}