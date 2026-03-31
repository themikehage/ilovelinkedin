import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/gallery - Get all DONE portfolios (public gallery)
export async function GET() {
  try {
    const portfolios = await db.job.findMany({
      where: { 
        status: 'DONE',
        deployedUrl: { not: null },
      },
      select: {
        id: true,
        linkedinUrl: true,
        theme: true,
        deployedUrl: true,
        createdAt: true,
        scrapedData: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 most recent
    });

    return NextResponse.json({ portfolios });
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
