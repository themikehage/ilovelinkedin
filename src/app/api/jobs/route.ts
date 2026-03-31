import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { THEMES, MAX_PORTFOLIOS_PER_USER } from '@/lib/types';
import { triggerScraper } from '@/lib/hooks';

function getUserUuid(request: NextRequest): string | null {
  return request.headers.get('x-user-uuid');
}

function isValidLinkedInUrl(url: string): boolean {
  const patterns = [
    /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
    /^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
  ];
  return patterns.some((p) => p.test(url));
}

function isValidTheme(theme: string): boolean {
  return THEMES.some((t) => t.id === theme);
}

// GET /api/jobs - List all jobs for the current user
export async function GET(request: NextRequest) {
  const userUuid = getUserUuid(request);

  if (!userUuid) {
    return NextResponse.json({ error: 'Missing x-user-uuid header' }, { status: 401 });
  }

  try {
    const jobs = await db.job.findMany({
      where: { userUuid },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job and trigger scraper
export async function POST(request: NextRequest) {
  const userUuid = getUserUuid(request);

  if (!userUuid) {
    return NextResponse.json({ error: 'Missing x-user-uuid header' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { linkedinUrl, theme } = body;

    // Validate LinkedIn URL
    if (!linkedinUrl || !isValidLinkedInUrl(linkedinUrl)) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL. Must be a valid LinkedIn profile URL.' },
        { status: 400 }
      );
    }

    // Validate theme
    if (!theme || !isValidTheme(theme)) {
      return NextResponse.json(
        { error: `Invalid theme. Choose from: ${THEMES.map((t) => t.id).join(', ')}` },
        { status: 400 }
      );
    }

    // Check user quota
    const jobCount = await db.job.count({ where: { userUuid } });
    if (jobCount >= MAX_PORTFOLIOS_PER_USER) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_PORTFOLIOS_PER_USER} portfolios reached.` },
        { status: 409 }
      );
    }

    // Get IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || null;

    // Create the job with PENDING_SCRAPE status (orchestrator picks it up)
    const job = await db.job.create({
      data: {
        userUuid,
        ipAddress: ip,
        linkedinUrl,
        theme,
        status: 'PENDING_SCRAPE',
      },
    });

    // Trigger the scraper agent hook asynchronously
    triggerScraper(linkedinUrl, job.id).catch((err) => {
      console.error('Failed to trigger scraper:', err);
      // Update job status to FAILED if scraper trigger fails
      db.job.update({
        where: { id: job.id },
        data: { status: 'FAILED', errorMessage: 'Failed to trigger scraper agent' },
      }).catch(console.error);
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
