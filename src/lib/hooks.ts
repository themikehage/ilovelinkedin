// OpenClaw Hook Client

interface HookPayload {
  message: string;
  agentId: string;
  wakeMode: 'now' | 'idle';
}

interface HookResponse {
  success: boolean;
  executionId?: string;
  error?: string;
}

export async function callAgentHook(
  message: string,
  agentId: string
): Promise<HookResponse> {
  const hookUrl = process.env.HOOK_URL;
  const hookSecret = process.env.HOOK_SECRET;

  if (!hookUrl || !hookSecret) {
    console.error('[Hook] Missing HOOK_URL or HOOK_SECRET environment variables');
    return { success: false, error: 'Hook not configured' };
  }

  const payload: HookPayload = {
    message,
    agentId,
    wakeMode: 'now',
  };

  try {
    const response = await fetch(`${hookUrl}/hooks/agent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hookSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Hook] Agent ${agentId} failed:`, response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    console.log(`[Hook] Agent ${agentId} triggered successfully:`, data);
    return { success: true, executionId: data.executionId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Hook] Agent ${agentId} error:`, message);
    return { success: false, error: message };
  }
}

export async function triggerScraper(
  linkedinUrl: string,
  jobId: string
): Promise<HookResponse> {
  const agentId = process.env.SCRAPER_AGENT_ID || 'scraper';
  const message = `Scrape LinkedIn profile: ${linkedinUrl}. Store scraped data in job ${jobId}. Then call back at ${process.env.APP_URL || 'https://ilovelinkedin.vercel.app'}/api/jobs/${jobId}/scrape-complete when done.`;
  return callAgentHook(message, agentId);
}

export async function triggerWebBuilder(
  jobId: string
): Promise<HookResponse> {
  const agentId = process.env.WEB_BUILDER_AGENT_ID || 'web-builder';
  const message = `Build portfolio for job ${jobId}. Read scraped data from DB, generate the portfolio HTML, deploy it, and call back at ${process.env.APP_URL || 'https://ilovelinkedin.vercel.app'}/api/jobs/${jobId}/build-complete with the deployed URL.`;
  return callAgentHook(message, agentId);
}
