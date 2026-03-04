import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { sendGuestConfirmation, sendAdminNotification } from '@/lib/emails/send';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!stripe) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { booking_id, payment_type } = paymentIntent.metadata;

        if (!booking_id) {
          console.error('No booking_id in payment intent metadata');
          break;
        }

        if (payment_type === 'deposit') {
          const { data: booking, error: updateError } = await supabase
            .from('bookings')
            .update({
              deposit_paid: true,
              status: 'confirmed',
            })
            .eq('id', booking_id)
            .select()
            .single();

          if (updateError) {
            console.error('Failed to update booking:', updateError);
            break;
          }

          if (booking) {
            try {
              await Promise.all([
                sendGuestConfirmation(booking),
                sendAdminNotification(booking),
              ]);
            } catch (emailError) {
              console.error('Failed to send confirmation emails:', emailError);
            }
          }
        } else if (payment_type === 'balance') {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              balance_paid: true,
            })
            .eq('id', booking_id);

          if (updateError) {
            console.error('Failed to update balance payment:', updateError);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { booking_id, payment_type } = paymentIntent.metadata;

        if (!booking_id) {
          console.error('No booking_id in payment intent metadata');
          break;
        }

        if (payment_type === 'deposit') {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'cancelled',
            })
            .eq('id', booking_id);

          if (updateError) {
            console.error('Failed to cancel booking:', updateError);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
