"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { Check, AlertCircle, MessageSquare, Loader2 } from "lucide-react";

const NIGHTLY_RATE = Number(process.env.NEXT_PUBLIC_NIGHTLY_RATE) || 450;

interface QuoteRequestFormProps {
  dateRange: DateRange | undefined;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  proposedNightlyRate: string;
  proposedTotal: string;
  numGuests: string;
  message: string;
}

export function QuoteRequestForm({ dateRange }: QuoteRequestFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    proposedNightlyRate: "",
    proposedTotal: "",
    numGuests: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const isDateSelected = dateRange?.from && dateRange?.to;
  const numberOfNights = isDateSelected
    ? differenceInDays(dateRange.to!, dateRange.from!)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          checkIn: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
          checkOut: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
          proposedNightlyRate: formData.proposedNightlyRate ? parseFloat(formData.proposedNightlyRate) : undefined,
          proposedTotal: formData.proposedTotal ? parseFloat(formData.proposedTotal) : undefined,
          numGuests: formData.numGuests ? parseInt(formData.numGuests) : undefined,
          message: formData.message || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Request Sent!</h3>
          <p className="text-muted-foreground">
            Thank you! We&apos;ll review your quote request and get back to you shortly at{" "}
            <strong>{formData.email}</strong>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Request a Quote
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Want to discuss pricing? Share your dates and proposed rate. We&apos;ll get back to you.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isDateSelected && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Selected dates</p>
              <p className="font-medium">
                {format(dateRange!.from!, "MMM d")} - {format(dateRange!.to!, "MMM d, yyyy")}
                {" "}({numberOfNights} nights)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Standard rate: ${NIGHTLY_RATE}/night
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quote-firstName">First Name *</Label>
              <Input
                id="quote-firstName"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-lastName">Last Name *</Label>
              <Input
                id="quote-lastName"
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
              <Label htmlFor="quote-email">Email *</Label>
              <Input
                id="quote-email"
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
              <Label htmlFor="quote-phone">Phone *</Label>
              <Input
                id="quote-phone"
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quote-rate">Proposed Rate (per night)</Label>
              <Input
                id="quote-rate"
                type="number"
                min="1"
                step="1"
                placeholder={`e.g. ${NIGHTLY_RATE}`}
                value={formData.proposedNightlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, proposedNightlyRate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-total">Proposed Total (optional)</Label>
              <Input
                id="quote-total"
                type="number"
                min="1"
                step="1"
                placeholder="Total for entire stay"
                value={formData.proposedTotal}
                onChange={(e) =>
                  setFormData({ ...formData, proposedTotal: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote-guests">Number of Guests</Label>
            <Input
              id="quote-guests"
              type="number"
              min="1"
              max="8"
              placeholder="e.g. 4"
              value={formData.numGuests}
              onChange={(e) =>
                setFormData({ ...formData, numGuests: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote-message">Message</Label>
            <textarea
              id="quote-message"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Tell us about your stay or any questions..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          <Button type="submit" size="lg" variant="outline" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Quote Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
