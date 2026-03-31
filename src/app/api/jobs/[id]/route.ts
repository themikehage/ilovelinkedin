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

// PATCH /api/jobs/[id] - Update a job (theme)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userUuid = getUserUuid(request);
  const { id } = await params;

  if (!userUuid) {
    return NextResponse.json({ error: 'Missing x-user-uuid header' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { theme } = body;

    const job = await db.job.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.userUuid !== userUuid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await db.job.update({
      where: { id },
      data: { theme },
    });

    return NextResponse.json({ job: updated });
  } catch (error) {
    console.error('PATCH /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userUuid = getUserUuid(request);
  const { id } = await params;

  if (!userUuid) {
    return NextResponse.json({ error: 'Missing x-user-uuid header' }, { status: 401 });
  }

  try {
    const job = await db.job.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.userUuid !== userUuid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await db.job.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
