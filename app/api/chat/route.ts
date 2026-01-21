import { NextRequest, NextResponse } from 'next/server';
import { getPrompt } from '@/lib/langfuse';

export async function POST(request: NextRequest) {
  try {
    const { prototypeId, promptName, message, history } = await request.json();

    if (!message || !promptName) {
      return NextResponse.json(
        { error: 'Message and promptName are required' },
        { status: 400 }
      );
    }

    console.log('Fetching Langfuse prompt:', promptName);

    // Step 1: Get the prompt from Langfuse
    const langfusePrompt = await getPrompt(promptName);

    if (!langfusePrompt || !langfusePrompt.prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Extract system prompt
    const systemPrompt = langfusePrompt.prompt.find(
      (p: any) => p.role === 'system'
    )?.content || '';

    console.log('Calling Perplexity API');

    // Step 2: Call Perplexity API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || [])
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Perplexity API error:', error);
      throw new Error(`Perplexity API error: ${error}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('Chat response generated successfully');

    return NextResponse.json({
      reply: reply
    });

  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate chat response' },
      { status: 500 }
    );
  }
}
