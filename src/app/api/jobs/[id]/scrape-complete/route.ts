import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { triggerWebBuilder } from '@/lib/hooks';

interface ScrapeCompleteBody {
  jobId: string;
  scrapedData: Record<string, unknown>;
  success: boolean;
  error?: string;
}

// POST /api/jobs/[id]/scrape-complete
// Called by OpenClaw scraper agent when scraping is done
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const authHeader = request.headers.get('authorization');

  // Simple token verification
  const expectedToken = process.env.HOOK_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: ScrapeCompleteBody = await request.json();
    const { scrapedData, success, error } = body;

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!success) {
      await db.job.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: error || 'Scraping failed' },
      });
      return NextResponse.json({ success: true, jobId, status: 'FAILED' });
    }

    // Update job with scraped data, move to BUILDING
    await db.job.update({
      where: { id: jobId },
      data: {
        status: 'BUILDING',
        scrapedData: scrapedData as object,
        errorMessage: null,
      },
    });

    // Trigger the web-builder agent
    triggerWebBuilder(jobId).catch((err) => {
      console.error('Failed to trigger web-builder:', err);
      db.job.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: 'Failed to trigger web-builder agent' },
      }).catch(console.error);
    });

    return NextResponse.json({ success: true, jobId, status: 'BUILDING' });
  } catch (error) {
    console.error('POST /api/jobs/[id]/scrape-complete error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
