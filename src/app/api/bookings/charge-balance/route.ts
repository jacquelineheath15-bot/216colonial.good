import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { getConfig } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin login required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { error: 'booking_id is required' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    const { data: booking, error: fetchError } = await serviceClient
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Booking must be confirmed to charge balance' },
        { status: 400 }
      );
    }

    if (booking.balance_paid) {
      return NextResponse.json(
        { error: 'Balance has already been paid' },
        { status: 400 }
      );
    }

    if (booking.balance_owed <= 0) {
      return NextResponse.json(
        { error: 'No balance owed' },
        { status: 400 }
      );
    }

    const config = getConfig();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.balance_owed * 100),
      currency: 'usd',
      metadata: {
        booking_id: booking.id,
        payment_type: 'balance',
        guest_email: booking.guest_email,
        property_name: config.propertyName,
      },
      receipt_email: booking.guest_email,
      description: `Balance payment for ${config.propertyName} - ${booking.check_in} to ${booking.check_out}`,
    });

    const { error: updateError } = await serviceClient
      .from('bookings')
      .update({
        stripe_payment_intent_balance: paymentIntent.id,
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: booking.balance_owed,
    });
  } catch (error) {
    console.error('Charge balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
