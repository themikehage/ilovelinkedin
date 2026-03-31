import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface BuildCompleteBody {
  jobId: string;
  deployedUrl: string;
  githubRepoUrl?: string;
  success: boolean;
  error?: string;
}

// POST /api/jobs/[id]/build-complete
// Called by OpenClaw web-builder agent when build is done
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
    const body: BuildCompleteBody = await request.json();
    const { deployedUrl, githubRepoUrl, success, error } = body;

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!success) {
      await db.job.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: error || 'Build failed' },
      });
      return NextResponse.json({ success: true, jobId, status: 'FAILED' });
    }

    // Update job with deployment info, mark as DONE
    await db.job.update({
      where: { id: jobId },
      data: {
        status: 'DONE',
        deployedUrl,
        githubRepoUrl: githubRepoUrl || null,
        errorMessage: null,
        needsAiBuild: false,
      },
    });

    return NextResponse.json({ success: true, jobId, status: 'DONE', deployedUrl });
  } catch (error) {
    console.error('POST /api/jobs/[id]/build-complete error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
