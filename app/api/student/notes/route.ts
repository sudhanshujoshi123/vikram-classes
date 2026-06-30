import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const medium = searchParams.get('medium');
    const classNum = searchParams.get('class');
    const subject = searchParams.get('subject');

    console.log('📚 Fetching notes for:', { medium, classNum, subject });

    const result = await pool.query(
      `SELECT id, medium, class, subject, chapter_name, pdf_url, created_at 
       FROM notes 
       WHERE medium = $1 AND class = $2 AND subject = $3 
       ORDER BY chapter_name`,
      [medium, classNum, subject]
    );

    console.log('✅ Notes from DB:', result.rows);
    if (result.rows.length > 0) {
      console.log('✅ First note ID:', result.rows[0].id);
    }

    return NextResponse.json({
      notes: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    return NextResponse.json({ notes: [] }, { status: 500 });
  }
}