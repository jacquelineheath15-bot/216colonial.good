import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  Plane,
  Gift,
  Utensils,
  Clock,
  Shirt,
  Luggage,
  MapPin,
  Dumbbell,
  Package,
  Car,
} from "lucide-react";

const hospitalityServices = [
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    description:
      "Professional cleaning service available daily or on your preferred schedule throughout your stay.",
  },
  {
    icon: Shirt,
    title: "Fresh Linens & Towels",
    description:
      "Regular exchange of premium linens and towels—not just at turnover, but whenever you need.",
  },
  {
    icon: Phone,
    title: "Concierge Services",
    description:
      "Restaurant reservations, activity bookings, and personalized local recommendations from our team.",
  },
  {
    icon: Luggage,
    title: "Luggage Assistance",
    description:
      "Secure luggage storage and assistance for early arrivals or late departures.",
  },
  {
    icon: Utensils,
    title: "Breakfast & Meal Service",
    description:
      "Light continental breakfast or catered meals arranged to start your day in Palm Beach style.",
  },
  {
    icon: Clock,
    title: "24/7 Host Availability",
    description:
      "Round-the-clock on-call host support for anything you need during your stay.",
  },
];

const experienceAddOns = [
  {
    icon: Car,
    title: "Airport Transportation",
    description:
      "Private car service or airport shuttle to and from Palm Beach International (PBI).",
  },
  {
    icon: MapPin,
    title: "Curated Experiences",
    description:
      "Exclusive tour packages—city tours, yacht charters, golf outings, and outdoor adventures.",
  },
  {
    icon: Gift,
    title: "Welcome Baskets",
    description:
      "Curated local products, gourmet treats, and Palm Beach essentials awaiting your arrival.",
  },
  {
    icon: Dumbbell,
    title: "Wellness Services",
    description:
      "In-home massage, private yoga instruction, or personal training sessions arranged on request.",
  },
  {
    icon: Package,
    title: "Package Management",
    description:
      "Secure receiving and delivery management for packages and shipments during your stay.",
  },
  {
    icon: Plane,
    title: "Travel Planning",
    description:
      "Assistance with excursions, day trips to Miami or the Keys, and local adventure planning.",
  },
];

export function GuestServices() {
  return (
    <section id="guest-services" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Premium Guest Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Elevated Hospitality,
            <br />
            Tailored to You
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Enhance your Palm Beach escape with our curated selection of premium 
            services and experiences. Every detail attended to, every need anticipated.
          </p>
        </div>

        {/* Hospitality Services */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center mb-8">
            Hospitality & Comfort
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitalityServices.map((service) => (
              <Card
                key={service.title}
                className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience Add-Ons */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center mb-8">
            Experiences & Conveniences
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceAddOns.map((service) => (
              <Card
                key={service.title}
                className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-amber-700" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Interested in any of these services? Let us know when you book or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-black/90" asChild>
              <Link href="/booking">Book Your Stay</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
