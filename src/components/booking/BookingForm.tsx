"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { Check, AlertCircle, Loader2, CreditCard } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import type { CreateBookingResponse } from "@/types/booking";

interface BookingFormProps {
  dateRange: DateRange | undefined;
}

const NIGHTLY_RATE = Number(process.env.NEXT_PUBLIC_NIGHTLY_RATE) || 450;
const CLEANING_FEE = Number(process.env.NEXT_PUBLIC_CLEANING_FEE) || 150;
const SERVICE_FEE_PERCENTAGE =
  Number(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE) || 0.12;
const DEPOSIT_PERCENTAGE =
  Number(process.env.NEXT_PUBLIC_DEPOSIT_PERCENTAGE) || 0.3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  guests: string;
  specialRequests: string;
}

type BookingStep = "form" | "payment" | "success";

function PaymentForm({
  onSuccess,
  onError,
  depositAmount,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
  depositAmount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking?success=true`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Payment failed");
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-blue-800 font-medium">Deposit Amount</span>
          <span className="text-blue-800 font-bold text-xl">
            ${depositAmount.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          This is 30% of your total. The remaining balance is due 7 days before
          check-in.
        </p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Deposit ${depositAmount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
}

export function BookingForm({ dateRange }: BookingFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    guests: "",
    specialRequests: "",
  });
  const [step, setStep] = React.useState<BookingStep>("form");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const [depositAmount, setDepositAmount] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  const isDateSelected = dateRange?.from && dateRange?.to;
  const numberOfNights = isDateSelected
    ? differenceInDays(dateRange.to!, dateRange.from!)
    : 0;

  const subtotal = numberOfNights * NIGHTLY_RATE;
  const cleaningFee = CLEANING_FEE;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENTAGE);
  const calculatedTotal = subtotal + cleaningFee + serviceFee;
  const calculatedDeposit =
    Math.round(calculatedTotal * DEPOSIT_PERCENTAGE * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateSelected) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_in: format(dateRange.from!, "yyyy-MM-dd"),
          check_out: format(dateRange.to!, "yyyy-MM-dd"),
          guest_first_name: formData.firstName,
          guest_last_name: formData.lastName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          guest_address: formData.address || undefined,
          num_guests: parseInt(formData.guests),
          special_requests: formData.specialRequests || undefined,
        }),
      });

      const data: CreateBookingResponse & { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setClientSecret(data.client_secret);
      setBookingId(data.booking_id);
      setDepositAmount(data.deposit_amount);
      setTotalPrice(data.total_price);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  if (step === "success") {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            Your reservation for{" "}
            {dateRange?.from && format(dateRange.from, "MMM d")} -{" "}
            {dateRange?.to && format(dateRange.to, "MMM d, yyyy")} has been
            confirmed.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-left mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Deposit Paid:</span>
              <span className="font-medium text-green-600">
                ${depositAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Balance Due:</span>
              <span className="font-medium">
                ${(totalPrice - depositAmount).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email has been sent to {formData.email}. The
            remaining balance is due 7 days before check-in.
          </p>
          <p className="text-xs text-muted-foreground">
            Booking ID: {bookingId}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === "payment" && clientSecret) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Complete Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0f172a",
                },
              },
            }}
          >
            <PaymentForm
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              depositAmount={depositAmount}
            />
          </Elements>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => {
              setStep("form");
              setClientSecret(null);
              setError(null);
            }}
          >
            ← Back to booking details
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Guest Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isDateSelected && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>
                Please select your check-in and check-out dates first.
              </span>
            </div>
          )}

          {isDateSelected && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Your Stay</p>
                  <p className="font-medium">
                    {format(dateRange.from!, "MMM d")} -{" "}
                    {format(dateRange.to!, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{numberOfNights} nights</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, State ZIP"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests *</Label>
            <Select
              value={formData.guests}
              onValueChange={(value) =>
                setFormData({ ...formData, guests: value })
              }
              required
            >
              <SelectTrigger id="guests">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any special requests or questions?"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
            />
          </div>

          <Separator />

          {isDateSelected && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-800">
                  <span>
                    ${NIGHTLY_RATE} × {numberOfNights} nights
                  </span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-blue-800">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between text-blue-800">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-blue-900 pt-2 border-t border-blue-200">
                  <span>Total</span>
                  <span>${calculatedTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-900 pt-2">
                  <span>Deposit due today (30%)</span>
                  <span>${calculatedDeposit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <h4 className="font-medium">House Rules</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Check-in: 4:00 PM - 10:00 PM</li>
              <li>• Check-out: 11:00 AM</li>
              <li>• No smoking</li>
              <li>• No parties or events</li>
              <li>• Pets allowed with prior approval</li>
            </ul>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!isDateSelected || !formData.guests || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating booking...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You&apos;ll pay a 30% deposit now. The remaining balance is due 7
            days before check-in.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
