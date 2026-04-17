import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function getUserUuid(request: NextRequest): string | null {
  return request.headers.get('x-user-uuid');
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

// POST /api/jobs - Disabled (read-only mode)
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is disabled. The platform is in read-only mode.' },
    { status: 403 }
  );
}
