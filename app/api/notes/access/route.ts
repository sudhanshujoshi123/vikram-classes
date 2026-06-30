import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { studentId, chapterId, className } = body;

    console.log(' Access Request:', { studentId, chapterId, className });

    // Convert to proper types
    studentId = Number(studentId);
    chapterId = Number(chapterId);
    className = String(className);

    // Validation
    if (!studentId || !chapterId || !className) {
      console.error('❌ Missing fields:', { studentId, chapterId, className });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          received: { studentId, chapterId, className }
        },
        { status: 400 }
      );
    }

    // Check subscription for this specific chapter
    const subResult = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE student_id = $1 
       AND class_name = $2
       AND chapter_id = $3
       AND is_active = true
       AND expires_at > NOW()`,
      [studentId, className, chapterId]
    );

    console.log('✅ Subscription check:', subResult.rows.length, 'found');

    if (subResult.rows.length === 0) {
      console.log('❌ No subscription found - payment required');
      return NextResponse.json(
        { 
          success: false, 
          requiresPayment: true,
          error: 'Payment required for this chapter',
          chapterId: chapterId,
        },
        { status: 403 }
      );
    }

    // Get the note
    const noteResult = await pool.query(
      'SELECT * FROM notes WHERE id = $1',
      [chapterId]
    );

    if (noteResult.rows.length === 0) {
      console.error('❌ Chapter not found:', chapterId);
      return NextResponse.json(
        { success: false, error: 'Chapter not found' },
        { status: 404 }
      );
    }

    const note = noteResult.rows[0];
    console.log('✅ Chapter found:', note.chapter_name);

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        chapter_name: note.chapter_name,
        url: note.pdf_url
      },
      subscription: {
        expiresAt: subResult.rows[0].expires_at
      }
    });

  } catch (error) {
    console.error('💥 Notes access error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to access notes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}