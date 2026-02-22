import { Resend } from 'resend';
import { BookingConfirmationGuest } from './booking-confirmation-guest';
import { BookingConfirmationAdmin } from './booking-confirmation-admin';
import { getConfig } from '@/lib/pricing';
import type { Booking } from '@/types/booking';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGuestConfirmation(booking: Booking) {
  const config = getConfig();

  const { error } = await resend.emails.send({
    from: `${config.propertyName} <bookings@${getDomain()}>`,
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
    from: `${config.propertyName} Bookings <bookings@${getDomain()}>`,
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

function getDomain(): string {
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
