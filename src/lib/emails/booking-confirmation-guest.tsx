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
import { format, parseISO, subDays } from 'date-fns';
import type { Booking } from '@/types/booking';

interface BookingConfirmationGuestProps {
  booking: Booking;
  propertyName: string;
  propertyAddress: string;
}

export function BookingConfirmationGuest({
  booking,
  propertyName,
  propertyAddress,
}: BookingConfirmationGuestProps) {
  const checkInDate = parseISO(booking.check_in);
  const checkOutDate = parseISO(booking.check_out);
  const balanceDueDate = subDays(checkInDate, 7);

  return (
    <Html>
      <Head />
      <Preview>Your booking at {propertyName} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmed!</Heading>
          
          <Text style={text}>
            Dear {booking.guest_first_name},
          </Text>
          
          <Text style={text}>
            Great news! Your reservation at <strong>{propertyName}</strong> has been confirmed.
            We&apos;re excited to host you!
          </Text>

          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>Reservation Details</Heading>
            
            <Text style={detailRow}>
              <strong>Property:</strong> {propertyName}
            </Text>
            <Text style={detailRow}>
              <strong>Address:</strong> {propertyAddress}
            </Text>
            <Text style={detailRow}>
              <strong>Check-in:</strong> {format(checkInDate, 'EEEE, MMMM d, yyyy')} (4:00 PM)
            </Text>
            <Text style={detailRow}>
              <strong>Check-out:</strong> {format(checkOutDate, 'EEEE, MMMM d, yyyy')} (11:00 AM)
            </Text>
            <Text style={detailRow}>
              <strong>Number of nights:</strong> {booking.nights}
            </Text>
            <Text style={detailRow}>
              <strong>Number of guests:</strong> {booking.num_guests}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>Payment Summary</Heading>
            
            <Text style={detailRow}>
              <strong>Total Price:</strong> ${booking.total_price.toFixed(2)}
            </Text>
            <Text style={detailRow}>
              <strong>Deposit Paid:</strong> ${booking.deposit_amount.toFixed(2)} ✓
            </Text>
            <Text style={detailRow}>
              <strong>Balance Due:</strong> ${booking.balance_owed.toFixed(2)}
            </Text>
            <Text style={noteText}>
              The remaining balance of ${booking.balance_owed.toFixed(2)} is due by{' '}
              {format(balanceDueDate, 'MMMM d, yyyy')} (7 days before check-in).
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>Your Information</Heading>
            
            <Text style={detailRow}>
              <strong>Name:</strong> {booking.guest_first_name} {booking.guest_last_name}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong> {booking.guest_email}
            </Text>
            <Text style={detailRow}>
              <strong>Phone:</strong> {booking.guest_phone}
            </Text>
            {booking.special_requests && (
              <Text style={detailRow}>
                <strong>Special Requests:</strong> {booking.special_requests}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>Check-in Instructions</Heading>
            
            <Text style={text}>
              Detailed check-in instructions will be sent to you 3 days before your arrival.
              In the meantime, please don&apos;t hesitate to reach out if you have any questions.
            </Text>
            
            <Text style={noteText}>
              <strong>House Rules:</strong>
              <br />• Check-in: 4:00 PM - 10:00 PM
              <br />• Check-out: 11:00 AM
              <br />• No smoking
              <br />• No parties or events
              <br />• Pets allowed with prior approval
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Thank you for choosing {propertyName}. We look forward to welcoming you!
          </Text>
          
          <Text style={footerSmall}>
            Confirmation ID: {booking.id}
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

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 16px',
};

const text = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 24px 16px',
};

const detailsSection = {
  padding: '0 24px',
  margin: '24px 0',
};

const detailRow = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const noteText = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  padding: '12px',
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px',
};

const footer = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '24px',
  textAlign: 'center' as const,
};

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 24px',
  textAlign: 'center' as const,
};

export default BookingConfirmationGuest;
