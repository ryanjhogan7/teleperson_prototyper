import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Prototype ID is required' },
        { status: 400 }
      );
    }

    // Sanitize the ID to prevent directory traversal
    const sanitizedId = id.replace(/[^a-z0-9-]/gi, '');

    // Use /tmp for Vercel serverless environment, otherwise use local prototypes directory
    const isVercel = process.env.VERCEL === '1';
    const prototypeDir = isVercel ? '/tmp/prototypes' : path.join(process.cwd(), 'prototypes');
    const prototypeFilePath = path.join(prototypeDir, `${sanitizedId}.html`);

    // Read the HTML file
    const html = await readFile(prototypeFilePath, 'utf-8');

    // Return HTML response
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: any) {
    console.error('Error serving prototype:', error);

    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Prototype not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to load prototype' },
      { status: 500 }
    );
  }
}
