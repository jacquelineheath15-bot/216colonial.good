import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

/** Debug endpoint - remove or restrict in production */
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json({
        ok: false,
        error: 'Missing env vars',
        hasUrl: !!url,
        hasKey: !!key,
      }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        code: error.code,
        details: error.details,
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tableExists: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      ok: false,
      error: message,
      stack: process.env.NODE_ENV === 'development' && err instanceof Error ? err.stack : undefined,
    }, { status: 500 });
  }
}
