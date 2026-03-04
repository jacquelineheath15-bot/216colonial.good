import { Resend } from 'resend';
import { BookingConfirmationGuest } from './booking-confirmation-guest';
import { BookingConfirmationAdmin } from './booking-confirmation-admin';
import { QuoteRequestAdmin } from './quote-request-admin';
import { getConfig } from '@/lib/pricing';
import type { Booking } from '@/types/booking';

export interface QuoteRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn?: string;
  checkOut?: string;
  proposedNightlyRate?: number;
  proposedTotal?: number;
  numGuests?: number;
  message?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGuestConfirmation(booking: Booking) {
  const config = getConfig();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: booking.guest_email,
    subject: `Booking Confirmed - ${config.propertyName}`,
    react: BookingConfirmationGuest({
      booking,
      propertyName: config.propertyName,
      propertyAddress: config.propertyAddress,
    }),
  });

  if (error) {
    console.error('Failed to send guest confirmation email:', error);
    throw error;
  }

  return { success: true };
}

export async function sendAdminNotification(booking: Booking) {
  const config = getConfig();

  if (!config.adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return { success: false, reason: 'no_admin_email' };
  }

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: config.adminEmail,
    subject: `New Booking: ${booking.guest_first_name} ${booking.guest_last_name} - ${booking.check_in} to ${booking.check_out}`,
    react: BookingConfirmationAdmin({
      booking,
      propertyName: config.propertyName,
    }),
  });

  if (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }

  return { success: true };
}

export async function sendQuoteRequestToAdmin(input: QuoteRequestInput) {
  const config = getConfig();
  const to = config.adminEmail || 'jackie@inglewoodridge.com';

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: `Quote Request: ${input.firstName} ${input.lastName} - ${config.propertyName}`,
    react: QuoteRequestAdmin({
      propertyName: config.propertyName,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      proposedNightlyRate: input.proposedNightlyRate,
      proposedTotal: input.proposedTotal,
      numGuests: input.numGuests,
      message: input.message,
    }),
  });

  if (error) {
    console.error('Failed to send quote request email:', error);
    throw error;
  }

  return { success: true };
}

function getDomain(): string {
  if (process.env.RESEND_USE_ONBOARDING === 'true') {
    return 'resend.dev';
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const url = new URL(baseUrl);
    if (url.hostname === 'localhost') {
      return 'resend.dev';
    }
    return url.hostname;
  } catch {
    return 'resend.dev';
  }
}

/** Resend requires onboarding@resend.dev when using their domain; custom domains use bookings@ */
function getFromAddress(): string {
  const config = getConfig();
  const domain = getDomain();
  const localPart = domain === 'resend.dev' ? 'onboarding' : 'bookings';
  return `${config.propertyName} <${localPart}@${domain}>`;
}
