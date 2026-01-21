import { NextRequest, NextResponse } from 'next/server';
import { researchCompanyAndGeneratePrompt } from '@/lib/perplexity';
import { createPrompt } from '@/lib/langfuse';
import { generatePrototypeHTML, slugify } from '@/lib/utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('Researching company and generating prompt for:', url);

    // Step 1: Research company and generate Langfuse prompt using Perplexity
    const companyData = await researchCompanyAndGeneratePrompt(url);

    console.log('Company research complete:', companyData.companyName);

    // Step 2: Generate slug for the company
    const slug = slugify(companyData.companyName);
    const promptName = `teleperson-demo-${slug}`;

    console.log('Creating Langfuse prompt:', promptName);

    // Step 3: Save prompt to Langfuse
    await createPrompt({
      companyName: companyData.companyName,
      slug: slug,
      industry: companyData.industry,
      promptContent: companyData.langfusePrompt
    });

    console.log('Langfuse prompt created successfully');

    // Step 4: Generate prototype HTML
    const html = generatePrototypeHTML({
      companyName: companyData.companyName,
      slug: slug,
      primaryColor: companyData.primaryColor,
      services: companyData.services,
      promptName: promptName
    });

    // Step 5: Save HTML file
    // Use /tmp for Vercel serverless environment, otherwise use local prototypes directory
    const isVercel = process.env.VERCEL === '1';
    const prototypeDir = isVercel ? '/tmp/prototypes' : path.join(process.cwd(), 'prototypes');

    // Ensure directory exists
    await mkdir(prototypeDir, { recursive: true });

    const prototypeFilePath = path.join(prototypeDir, `${slug}.html`);
    await writeFile(prototypeFilePath, html, 'utf-8');

    console.log('Prototype HTML saved:', prototypeFilePath);

    // Step 6: Return success response
    return NextResponse.json({
      prototypeId: slug,
      previewUrl: `/api/prototype/${slug}`,
      companyName: companyData.companyName,
      industry: companyData.industry,
      promptName: promptName
    });

  } catch (error: any) {
    console.error('Error generating prototype:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate prototype' },
      { status: 500 }
    );
  }
}
