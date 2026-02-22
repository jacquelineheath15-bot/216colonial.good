import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from '@react-email/components';
import { format, parseISO } from 'date-fns';
import type { Booking } from '@/types/booking';

interface BookingConfirmationAdminProps {
  booking: Booking;
  propertyName: string;
}

export function BookingConfirmationAdmin({
  booking,
  propertyName,
}: BookingConfirmationAdminProps) {
  const checkInDate = parseISO(booking.check_in);
  const checkOutDate = parseISO(booking.check_out);

  return (
    <Html>
      <Head />
      <Preview>New booking confirmed for {propertyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Confirmed</Heading>
          
          <Text style={text}>
            A new booking has been confirmed for <strong>{propertyName}</strong>.
          </Text>

          <Section style={tableContainer}>
            <table style={table}>
              <tbody>
                <tr>
                  <th style={tableHeader} colSpan={2}>Booking Details</th>
                </tr>
                <tr>
                  <td style={tableLabel}>Booking ID</td>
                  <td style={tableValue}>{booking.id}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Created</td>
                  <td style={tableValue}>
                    {format(parseISO(booking.created_at), 'MMM d, yyyy h:mm a')}
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Status</td>
                  <td style={tableValue}>
                    <span style={statusBadge}>{booking.status.toUpperCase()}</span>
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Check-in</td>
                  <td style={tableValue}>{format(checkInDate, 'EEE, MMM d, yyyy')}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Check-out</td>
                  <td style={tableValue}>{format(checkOutDate, 'EEE, MMM d, yyyy')}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Nights</td>
                  <td style={tableValue}>{booking.nights}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Guests</td>
                  <td style={tableValue}>{booking.num_guests}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={tableContainer}>
            <table style={table}>
              <tbody>
                <tr>
                  <th style={tableHeader} colSpan={2}>Guest Information</th>
                </tr>
                <tr>
                  <td style={tableLabel}>Name</td>
                  <td style={tableValue}>
                    {booking.guest_first_name} {booking.guest_last_name}
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Email</td>
                  <td style={tableValue}>
                    <a href={`mailto:${booking.guest_email}`} style={link}>
                      {booking.guest_email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Phone</td>
                  <td style={tableValue}>
                    <a href={`tel:${booking.guest_phone}`} style={link}>
                      {booking.guest_phone}
                    </a>
                  </td>
                </tr>
                {booking.guest_address && (
                  <tr>
                    <td style={tableLabel}>Address</td>
                    <td style={tableValue}>{booking.guest_address}</td>
                  </tr>
                )}
                {booking.special_requests && (
                  <tr>
                    <td style={tableLabel}>Special Requests</td>
                    <td style={tableValue}>{booking.special_requests}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Section style={tableContainer}>
            <table style={table}>
              <tbody>
                <tr>
                  <th style={tableHeader} colSpan={2}>Payment Information</th>
                </tr>
                <tr>
                  <td style={tableLabel}>Total Price</td>
                  <td style={tableValue}>${booking.total_price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Deposit Amount</td>
                  <td style={tableValue}>${booking.deposit_amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Deposit Paid</td>
                  <td style={tableValue}>
                    {booking.deposit_paid ? '✓ Yes' : '✗ No'}
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Balance Owed</td>
                  <td style={tableValue}>${booking.balance_owed.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Balance Paid</td>
                  <td style={tableValue}>
                    {booking.balance_paid ? '✓ Yes' : '✗ No'}
                  </td>
                </tr>
                {booking.stripe_payment_intent_deposit && (
                  <tr>
                    <td style={tableLabel}>Stripe Deposit ID</td>
                    <td style={tableValue}>{booking.stripe_payment_intent_deposit}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated notification from your booking system.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '24px 24px 16px',
};

const text = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 24px 16px',
};

const tableContainer = {
  padding: '0 24px',
  margin: '24px 0',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
};

const tableHeader = {
  backgroundColor: '#f9fafb',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px',
  textAlign: 'left' as const,
  borderBottom: '1px solid #e5e7eb',
};

const tableLabel = {
  color: '#6b7280',
  fontSize: '13px',
  padding: '10px 12px',
  width: '140px',
  borderBottom: '1px solid #e5e7eb',
  verticalAlign: 'top' as const,
};

const tableValue = {
  color: '#1f2937',
  fontSize: '13px',
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
};

const statusBadge = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '600',
  padding: '4px 8px',
  borderRadius: '4px',
};

const link = {
  color: '#2563eb',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 24px',
  textAlign: 'center' as const,
};

export default BookingConfirmationAdmin;
