"use client";

import * as React from "react";
import Link from "next/link";
import { BookingCalendar, BookingForm } from "@/components/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type DateRange } from "react-day-picker";
import {
  ArrowLeft,
  Bed,
  Bath,
  Waves,
  MapPin,
  Award,
  Shield,
} from "lucide-react";

export default function BookingPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Property
            </Link>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              216 Colonial Ln
            </Link>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            <Award className="h-3 w-3 mr-1 text-amber-600" />
            Schuler Award Winner
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Book Your Stay
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Select your dates and complete your reservation at 216 Colonial Lane
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BookingCalendar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <BookingForm dateRange={dateRange} />
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/hero-house.png')`,
                  }}
                />
                <div className="bg-white p-5">
                  <h3 className="font-semibold text-lg">216 Colonial Lane</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    North End, Palm Beach
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span>3+1 Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span>3 Ensuite</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Waves className="h-4 w-4" />
                      <span>Beach Access</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Art Deco jewel box built in 2013 with private beach access, 
                      solar panels, and award-winning architecture.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Secure Booking</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your payment information is encrypted and secure. We never
                      store your full credit card details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                <h4 className="font-medium text-sm mb-2">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Have questions about the property or booking process?
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Host
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
