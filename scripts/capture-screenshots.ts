import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function cloudinaryUpload(filePath: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = execSync(
    `echo -n "folder=ilovelinkedin&timestamp=${timestamp}tOOxApDyol3RJhpLOc2GnJK-86I" | openssl dgst -sha256 | cut -d' ' -f2`,
    { encoding: 'utf8' }
  ).trim();

  const result = execSync(
    `curl -s -X POST "https://api.cloudinary.com/v1_1/dlvvyf4pn/image/upload" \\
      -F "file=@${filePath}" \\
      -F "api_key=615683552667981" \\
      -F "timestamp=${timestamp}" \\
      -F "signature=${signature}" \\
      -F "folder=ilovelinkedin"`,
    { encoding: 'utf8' }
  );

  const json = JSON.parse(result);
  if (!json.secure_url) throw new Error(`Cloudinary upload failed: ${result}`);
  return json.secure_url;
}

async function captureScreenshot(url: string): Promise<string> {
  execSync(`agent-browser open ${url}`, { timeout: 30000 });
  execSync('sleep 3', { timeout: 10000 });
  execSync('agent-browser screenshot', { timeout: 30000 });

  const screenshot = execSync(
    'ls -t /run/user/0/agent-browser/tmp/screenshots/ | head -1',
    { encoding: 'utf8' }
  ).trim();

  return `/run/user/0/agent-browser/tmp/screenshots/${screenshot}`;
}

async function main() {
  const pendingJobs = await prisma.job.findMany({
    where: {
      status: 'DONE',
      deployedUrl: { not: null },
      screenshotUrl: null,
    },
    select: { id: true, deployedUrl: true },
  });

  if (pendingJobs.length === 0) {
    console.log('✅ All done — no portfolios need screenshots');
    await prisma.$disconnect();
    return;
  }

  console.log(`📸 ${pendingJobs.length} portfolio(s) need screenshots\n`);

  let success = 0;
  let failed = 0;

  for (const job of pendingJobs) {
    const url = job.deployedUrl!;
    process.stdout.write(`  ${url}... `);
    try {
      const screenshotPath = await captureScreenshot(url);
      const cloudinaryUrl = await cloudinaryUpload(screenshotPath);

      await prisma.job.update({
        where: { id: job.id },
        data: { screenshotUrl: cloudinaryUrl },
      });

      console.log(`✅`);
      success++;
    } catch (e: any) {
      console.log(`❌ ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done: ${success} succeeded, ${failed} failed`);
  await prisma.$disconnect();
}

main().catch(console.error);
