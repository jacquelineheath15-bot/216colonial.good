import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { calculatePricing, getConfig } from '@/lib/pricing';
import { parseISO, isValid } from 'date-fns';
import type { CreateBookingInput } from '@/types/booking';

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingInput = await request.json();

    const {
      check_in,
      check_out,
      guest_first_name,
      guest_last_name,
      guest_email,
      guest_phone,
      guest_address,
      num_guests,
      special_requests,
    } = body;

    if (
      !check_in ||
      !check_out ||
      !guest_first_name ||
      !guest_last_name ||
      !guest_email ||
      !guest_phone ||
      !num_guests
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guest_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'confirmed')
      .or(`and(check_in.lt.${check_out},check_out.gt.${check_in})`)
      .limit(1);

    if (conflictError) {
      console.error('Conflict check error:', conflictError);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Selected dates are not available' },
        { status: 409 }
      );
    }

    const pricing = calculatePricing(check_in, check_out);
    const config = getConfig();

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        status: 'pending',
        check_in,
        check_out,
        nights: pricing.nights,
        total_price: pricing.totalPrice,
        deposit_amount: pricing.depositAmount,
        deposit_paid: false,
        balance_owed: pricing.balanceOwed,
        balance_paid: false,
        guest_first_name,
        guest_last_name,
        guest_email,
        guest_phone,
        guest_address: guest_address || null,
        num_guests,
        special_requests: special_requests || null,
      })
      .select()
      .single();

    if (insertError || !booking) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pricing.depositAmount * 100),
      currency: 'usd',
      metadata: {
        booking_id: booking.id,
        payment_type: 'deposit',
        guest_email,
        property_name: config.propertyName,
      },
      receipt_email: guest_email,
      description: `Deposit for ${config.propertyName} - ${check_in} to ${check_out}`,
    });

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        stripe_payment_intent_deposit: paymentIntent.id,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    return NextResponse.json({
      booking_id: booking.id,
      client_secret: paymentIntent.client_secret,
      deposit_amount: pricing.depositAmount,
      total_price: pricing.totalPrice,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
