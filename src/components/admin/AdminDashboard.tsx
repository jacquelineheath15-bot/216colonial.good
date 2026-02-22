"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  RefreshCw,
  CreditCard,
  Check,
  X,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/types/booking";

interface AdminDashboardProps {
  bookings: Booking[];
  userEmail?: string;
}

export function AdminDashboard({
  bookings: initialBookings,
  userEmail,
}: AdminDashboardProps) {
  const router = useRouter();
  const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);
  const [loading, setLoading] = React.useState(false);
  const [chargeLoading, setChargeLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleRefresh = () => {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 500);
  };

  const handleChargeBalance = async (bookingId: string) => {
    setChargeLoading(bookingId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/bookings/charge-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      setSuccess(
        `Payment intent created for $${data.amount.toFixed(2)}. The guest will receive a payment link.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setChargeLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + Number(b.total_price), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Dashboard
              </h1>
              {userEmail && (
                <p className="text-sm text-gray-500">Logged in as {userEmail}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {stats.confirmed}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${stats.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No bookings yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Guest
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Dates
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Deposit
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Balance
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium">
                            {booking.guest_first_name} {booking.guest_last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.num_guests} guests
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">{booking.guest_email}</div>
                          <div className="text-sm text-gray-500">
                            {booking.guest_phone}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {format(parseISO(booking.check_in), "MMM d")} -{" "}
                            {format(parseISO(booking.check_out), "MMM d, yyyy")}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.nights} nights
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            ${Number(booking.deposit_amount).toFixed(2)}
                          </div>
                          {booking.deposit_paid ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200"
                            >
                              Paid
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-gray-500 border-gray-200"
                            >
                              Unpaid
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            ${Number(booking.balance_owed).toFixed(2)}
                          </div>
                          {booking.balance_paid ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200"
                            >
                              Paid
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-gray-500 border-gray-200"
                            >
                              Unpaid
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {booking.status === "confirmed" &&
                            !booking.balance_paid &&
                            Number(booking.balance_owed) > 0 && (
                              <Button
                                size="sm"
                                onClick={() => handleChargeBalance(booking.id)}
                                disabled={chargeLoading === booking.id}
                              >
                                {chargeLoading === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    Charge Balance
                                  </>
                                )}
                              </Button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
