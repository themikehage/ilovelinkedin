import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function getUserUuid(request: NextRequest): string | null {
  return request.headers.get('x-user-uuid');
}

// GET /api/jobs/[id] - Get a single job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userUuid = getUserUuid(request);
  const { id } = await params;

  if (!userUuid) {
    return NextResponse.json({ error: 'Missing x-user-uuid header' }, { status: 401 });
  }

  try {
    const job = await db.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.userUuid !== userUuid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// PATCH /api/jobs/[id] - Disabled (read-only mode)
export async function PATCH() {
  return NextResponse.json(
    { error: 'This endpoint is disabled. The platform is in read-only mode.' },
    { status: 403 }
  );
}

// DELETE /api/jobs/[id] - Disabled (read-only mode)
export async function DELETE() {
  return NextResponse.json(
    { error: 'This endpoint is disabled. The platform is in read-only mode.' },
    { status: 403 }
  );
}
