"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DateRange } from "react-day-picker";
import {
  differenceInDays,
  format,
  parseISO,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import { getNightlyRateWithPromo, isValidPromoCode } from "@/lib/promo-codes";

interface BookingCalendarProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  promoCode?: string;
}

interface BlockedDateRange {
  check_in: string;
  check_out: string;
}

const BASE_NIGHTLY_RATE = Number(process.env.NEXT_PUBLIC_NIGHTLY_RATE) || 450;
const CLEANING_FEE = Number(process.env.NEXT_PUBLIC_CLEANING_FEE) || 150;
const SERVICE_FEE_PERCENTAGE =
  Number(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE) || 0.12;
const DEPOSIT_PERCENTAGE =
  Number(process.env.NEXT_PUBLIC_DEPOSIT_PERCENTAGE) || 0.3;

export function BookingCalendar({
  dateRange,
  onDateRangeChange,
  promoCode = "",
}: BookingCalendarProps) {
  const [blockedDates, setBlockedDates] = React.useState<Date[]>([]);
  const [loading, setLoading] = React.useState(true);

  const nightlyRate = getNightlyRateWithPromo(BASE_NIGHTLY_RATE, promoCode);

  React.useEffect(() => {
    async function fetchBlockedDates() {
      try {
        const response = await fetch("/api/bookings/blocked-dates");
        if (response.ok) {
          const data = await response.json();
          const dates: Date[] = [];

          data.blocked.forEach((range: BlockedDateRange) => {
            const start = parseISO(range.check_in);
            const end = parseISO(range.check_out);
            const daysInRange = eachDayOfInterval({ start, end });
            daysInRange.slice(0, -1).forEach((day) => dates.push(day));
          });

          setBlockedDates(dates);
        }
      } catch (error) {
        console.error("Failed to fetch blocked dates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlockedDates();
  }, []);

  const numberOfNights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  const subtotal = numberOfNights * nightlyRate;
  const cleaningFee = CLEANING_FEE;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENTAGE);
  const total = subtotal + cleaningFee + serviceFee;
  const depositAmount = Math.round(total * DEPOSIT_PERCENTAGE * 100) / 100;
  const balanceOwed = Math.round((total - depositAmount) * 100) / 100;

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      (blockedDate) =>
        blockedDate.getFullYear() === date.getFullYear() &&
        blockedDate.getMonth() === date.getMonth() &&
        blockedDate.getDate() === date.getDate()
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Select Your Dates</CardTitle>
          <Badge variant="secondary" className="text-lg font-semibold">
            ${nightlyRate}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              /night
              {isValidPromoCode(promoCode) && (
                <span className="ml-1 text-green-600">(promo applied)</span>
              )}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                Loading availability...
              </div>
            </div>
          ) : (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              disabled={[{ before: new Date() }, isDateBlocked]}
              className="rounded-md border"
            />
          )}
        </div>

        {dateRange?.from && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">
                {format(dateRange.from, "EEE, MMM d, yyyy")}
              </span>
            </div>
            {dateRange?.to && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">
                    {format(dateRange.to, "EEE, MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${nightlyRate} x {numberOfNights} nights
                  </span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span className="font-medium">${cleaningFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="font-medium">${serviceFee}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${total}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800 font-medium">
                      Deposit due today (30%)
                    </span>
                    <span className="text-blue-800 font-bold">
                      ${depositAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">
                      Balance due 7 days before check-in
                    </span>
                    <span className="text-blue-600">
                      ${balanceOwed.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="w-3 h-3 bg-muted rounded-sm inline-block" />
            Unavailable dates
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
