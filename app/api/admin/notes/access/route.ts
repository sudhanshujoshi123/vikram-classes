import { NextResponse } from 'next/server';
import { pool, checkSubscription } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { studentId, medium, className, subject, chapterId } = await request.json();

    console.log('📝 Access Note Request:', { studentId, medium, className, subject, chapterId });

    // Validation
    if (!studentId || !className) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check subscription
    const subscription = await checkSubscription(studentId, className);

    if (!subscription) {
      console.log('❌ No subscription found');
      return NextResponse.json(
        { 
          success: false, 
          error: 'No active subscription for this class',
          requiresPayment: true,
          className: className,
        },
        { status: 403 }
      );
    }

    console.log('✅ Subscription found:', subscription);

    // Get chapter/notes details from database
    const result = await pool.query(
      `SELECT * FROM notes WHERE id = $1`,
      [chapterId]
    );

    if (result.rows.length === 0) {
      console.log('❌ Chapter not found');
      return NextResponse.json(
        { success: false, error: 'Chapter not found' },
        { status: 404 }
      );
    }

    const note = result.rows[0];
    console.log('✅ Chapter found:', note.chapter_name);

    // Generate Cloudinary URL
    let accessUrl = note.pdf_url;
    
    if (note.pdf_url && note.pdf_url.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      const urlParts = note.pdf_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
      
      accessUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true,
      });
    }

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        chapter_name: note.chapter_name,
        url: accessUrl,
      },
      subscription: {
        expiresAt: subscription.expires_at,
      },
    });

  } catch (error) {
    console.error('Notes access error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to access notes' },
      { status: 500 }
    );
  }
}