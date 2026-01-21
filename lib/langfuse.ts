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

function validateLangfuseCredentials() {
  if (!process.env.LANGFUSE_PUBLIC_KEY ||
      !process.env.LANGFUSE_SECRET_KEY ||
      process.env.LANGFUSE_PUBLIC_KEY === 'your_langfuse_public_key_here' ||
      process.env.LANGFUSE_SECRET_KEY === 'your_langfuse_secret_key_here') {
    throw new Error('Langfuse credentials are not configured. Please add LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY to your .env file. Get them from https://cloud.langfuse.com → Settings → API Keys');
  }
}

export async function createPrompt(data: LangfusePromptData): Promise<any> {
  validateLangfuseCredentials();

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
    console.error('Langfuse API error (createPrompt):', res.status, error);

    if (res.status === 401 || res.status === 403) {
      throw new Error(`Invalid Langfuse credentials. Please check your LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY in .env file. Get them from https://cloud.langfuse.com → Settings → API Keys. Error: ${error}`);
    } else if (res.status === 409) {
      console.log('Prompt already exists, this is expected');
      // Prompt already exists, which is fine
      return { message: 'Prompt already exists' };
    }

    throw new Error(`Langfuse API error (${res.status}): ${error}`);
  }

  return res.json();
}

export async function getPrompt(name: string): Promise<LangfusePromptResponse> {
  validateLangfuseCredentials();

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
    console.error('Langfuse API error (getPrompt):', res.status, error);

    if (res.status === 401 || res.status === 403) {
      throw new Error(`Invalid Langfuse credentials. Please check your LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY in .env file. Get them from https://cloud.langfuse.com → Settings → API Keys. Error: ${error}`);
    } else if (res.status === 404) {
      throw new Error(`Prompt "${name}" not found in Langfuse. Make sure you've generated a prototype for this company first.`);
    }

    throw new Error(`Langfuse API error (${res.status}): ${error}`);
  }

  return res.json();
}
