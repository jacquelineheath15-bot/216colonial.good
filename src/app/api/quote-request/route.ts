import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendQuoteRequestToAdmin } from '@/lib/emails/send';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      proposedNightlyRate,
      proposedTotal,
      numGuests,
      message,
    } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'First name, last name, email, and phone are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: inserted, error: insertError } = await supabase
      .from('quote_requests')
      .insert({
        guest_first_name: firstName.trim(),
        guest_last_name: lastName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        check_in: checkIn?.trim() || null,
        check_out: checkOut?.trim() || null,
        proposed_nightly_rate: proposedNightlyRate != null ? Number(proposedNightlyRate) : null,
        proposed_total: proposedTotal != null ? Number(proposedTotal) : null,
        num_guests: numGuests != null ? Number(numGuests) : null,
        message: message?.trim() || null,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      console.error('Quote request insert error:', insertError?.message, insertError?.details);
      return NextResponse.json(
        { error: 'Failed to save request. Please try again or contact us at (929) 765-9504.' },
        { status: 500 }
      );
    }

    // Try to send email notification - if it fails, we still succeeded (data is in DB)
    try {
      if (process.env.RESEND_API_KEY) {
        await sendQuoteRequestToAdmin({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          checkIn: checkIn?.trim() || undefined,
          checkOut: checkOut?.trim() || undefined,
          proposedNightlyRate: proposedNightlyRate != null ? Number(proposedNightlyRate) : undefined,
          proposedTotal: proposedTotal != null ? Number(proposedTotal) : undefined,
          numGuests: numGuests != null ? Number(numGuests) : undefined,
          message: message?.trim() || undefined,
        });
      }
    } catch (emailErr) {
      console.warn('Quote request email failed (request saved):', emailErr);
    }

    return NextResponse.json({ success: true, id: inserted.id });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Quote request error:', err.message, err);
    const showDetails = process.env.VERCEL_DEBUG_ERRORS === 'true';
    return NextResponse.json(
      {
        error: 'Failed to submit request. Please try again or contact us directly.',
        ...(showDetails && { details: err.message }),
      },
      { status: 500 }
    );
  }
}
