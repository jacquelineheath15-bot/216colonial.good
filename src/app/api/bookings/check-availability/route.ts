import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { parseISO, isValid, eachDayOfInterval, format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { check_in, check_out } = body;

    if (!check_in || !check_out) {
      return NextResponse.json(
        { error: 'check_in and check_out are required' },
        { status: 400 }
      );
    }

    const checkInDate = parseISO(check_in);
    const checkOutDate = parseISO(check_out);

    if (!isValid(checkInDate) || !isValid(checkOutDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'check_out must be after check_in' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: conflictingBookings, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('status', 'confirmed')
      .or(`and(check_in.lt.${check_out},check_out.gt.${check_in})`);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    const conflictingDates: string[] = [];
    
    if (conflictingBookings && conflictingBookings.length > 0) {
      conflictingBookings.forEach((booking) => {
        const bookingStart = parseISO(booking.check_in);
        const bookingEnd = parseISO(booking.check_out);
        
        const requestedStart = checkInDate > bookingStart ? checkInDate : bookingStart;
        const requestedEnd = checkOutDate < bookingEnd ? checkOutDate : bookingEnd;
        
        if (requestedStart < requestedEnd) {
          const overlappingDays = eachDayOfInterval({
            start: requestedStart,
            end: requestedEnd,
          });
          
          overlappingDays.forEach((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (!conflictingDates.includes(dateStr)) {
              conflictingDates.push(dateStr);
            }
          });
        }
      });
    }

    return NextResponse.json({
      available: conflictingDates.length === 0,
      conflicting_dates: conflictingDates,
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
