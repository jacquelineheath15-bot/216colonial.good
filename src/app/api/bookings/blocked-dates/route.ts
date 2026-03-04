import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Service configuration error', blocked: [] },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();

    const { data: confirmedBookings, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('status', 'confirmed')
      .gte('check_out', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blocked dates' },
        { status: 500 }
      );
    }

    const blocked = (confirmedBookings || []).map((booking) => ({
      check_in: booking.check_in,
      check_out: booking.check_out,
    }));

    return NextResponse.json({ blocked });
  } catch (error) {
    console.error('Blocked dates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
