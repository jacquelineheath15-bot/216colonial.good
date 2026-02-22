export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  created_at: string;
  status: BookingStatus;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  balance_owed: number;
  balance_paid: boolean;
  stripe_payment_intent_deposit: string | null;
  stripe_payment_intent_balance: string | null;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_address: string | null;
  num_guests: number;
  special_requests: string | null;
  notes: string | null;
}

export interface CreateBookingInput {
  check_in: string;
  check_out: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_address?: string;
  num_guests: number;
  special_requests?: string;
}

export interface BookingWithPricing extends CreateBookingInput {
  nights: number;
  total_price: number;
  deposit_amount: number;
  balance_owed: number;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflicting_dates: string[];
}

export interface BlockedDatesResponse {
  blocked: Array<{ check_in: string; check_out: string }>;
}

export interface CreateBookingResponse {
  booking_id: string;
  client_secret: string;
  deposit_amount: number;
  total_price: number;
}
