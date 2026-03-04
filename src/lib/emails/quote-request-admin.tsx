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

interface QuoteRequestAdminProps {
  propertyName: string;
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

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function QuoteRequestAdmin({
  propertyName,
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
}: QuoteRequestAdminProps) {
  return (
    <Html>
      <Head />
      <Preview>Quote request for {propertyName} from {firstName} {lastName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quote Request</Heading>

          <Text style={text}>
            Someone has requested a custom quote for <strong>{propertyName}</strong>.
          </Text>

          <Section style={tableContainer}>
            <table style={table}>
              <tbody>
                <tr>
                  <th style={tableHeader} colSpan={2}>Guest Information</th>
                </tr>
                <tr>
                  <td style={tableLabel}>Name</td>
                  <td style={tableValue}>{firstName} {lastName}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Email</td>
                  <td style={tableValue}>
                    <a href={`mailto:${email}`} style={link}>{email}</a>
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Phone</td>
                  <td style={tableValue}>
                    <a href={`tel:${phone}`} style={link}>{phone}</a>
                  </td>
                </tr>
                {(checkIn || checkOut) && (
                  <>
                    {checkIn && (
                      <tr>
                        <td style={tableLabel}>Requested Check-in</td>
                        <td style={tableValue}>{formatDate(checkIn)}</td>
                      </tr>
                    )}
                    {checkOut && (
                      <tr>
                        <td style={tableLabel}>Requested Check-out</td>
                        <td style={tableValue}>{formatDate(checkOut)}</td>
                      </tr>
                    )}
                  </>
                )}
                {numGuests && (
                  <tr>
                    <td style={tableLabel}>Number of Guests</td>
                    <td style={tableValue}>{numGuests}</td>
                  </tr>
                )}
                {(proposedNightlyRate ?? proposedTotal) && (
                  <>
                    {proposedNightlyRate != null && (
                      <tr>
                        <td style={tableLabel}>Proposed Rate (per night)</td>
                        <td style={tableValue}>${proposedNightlyRate.toFixed(2)}</td>
                      </tr>
                    )}
                    {proposedTotal != null && (
                      <tr>
                        <td style={tableLabel}>Proposed Total</td>
                        <td style={tableValue}>${proposedTotal.toFixed(2)}</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </Section>

          {message && (
            <Section style={messageSection}>
              <Text style={messageLabel}>Message from guest:</Text>
              <Text style={messageText}>{message}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Reply to this guest at {email} or call {phone} to discuss.
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

const link = {
  color: '#2563eb',
  textDecoration: 'none',
};

const messageSection = {
  padding: '0 24px',
  margin: '16px 0',
};

const messageLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '8px',
};

const messageText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
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

export default QuoteRequestAdmin;
