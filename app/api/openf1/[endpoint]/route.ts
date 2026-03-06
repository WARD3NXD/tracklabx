import { NextRequest, NextResponse } from 'next/server';

const OPENF1_BASE = 'https://api.openf1.org/v1';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> },
) {
  const { endpoint } = await params;

  const upstreamUrl = new URL(`${OPENF1_BASE}/${endpoint}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
      },
      next: { revalidate: 0 },
    });

    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type':
          upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('OpenF1 proxy request failed', {
      endpoint,
      error,
    });
    return NextResponse.json(
      { error: 'OpenF1 upstream unavailable' },
      { status: 502 },
    );
  }
}
