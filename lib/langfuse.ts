const LANGFUSE_HOST = 'https://cloud.langfuse.com';

export interface LangfusePromptData {
  companyName: string;
  slug: string;
  industry: string;
  promptContent: string;
}

export interface LangfusePromptResponse {
  name: string;
  version: number;
  prompt: Array<{ role: string; content: string }>;
}

export async function createPrompt(data: LangfusePromptData): Promise<any> {
  const auth = Buffer.from(
    `${process.env.LANGFUSE_PUBLIC_KEY}:${process.env.LANGFUSE_SECRET_KEY}`
  ).toString('base64');

  const promptName = `teleperson-demo-${data.slug}`;

  const res = await fetch(`${LANGFUSE_HOST}/api/public/v2/prompts`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'chat',
      name: promptName,
      prompt: [{
        role: 'system',
        content: data.promptContent
      }],
      labels: ['demo'],
      tags: [data.industry]
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Langfuse API error: ${error}`);
  }

  return res.json();
}

export async function getPrompt(name: string): Promise<LangfusePromptResponse> {
  const auth = Buffer.from(
    `${process.env.LANGFUSE_PUBLIC_KEY}:${process.env.LANGFUSE_SECRET_KEY}`
  ).toString('base64');

  const res = await fetch(
    `${LANGFUSE_HOST}/api/public/v2/prompts/${encodeURIComponent(name)}`,
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Langfuse API error: ${error}`);
  }

  return res.json();
}
