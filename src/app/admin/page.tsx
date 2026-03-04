import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("check_in", { ascending: true });

  const { data: quoteRequests = [] } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bookings:", error);
  }

  return (
    <AdminDashboard
      bookings={bookings || []}
      quoteRequests={quoteRequests || []}
      userEmail={user.email}
    />
  );
}
