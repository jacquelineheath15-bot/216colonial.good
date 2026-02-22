import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Waves,
  Sun,
  UtensilsCrossed,
  Car,
  Music,
  Sparkles,
  Home,
  TreePalm,
} from "lucide-react";

const services = [
  {
    icon: Waves,
    title: "Pool, Spa & Swim Jets",
    description:
      "Heated pool with swim jets and spa, perfect for exercise or relaxation with southern exposure.",
  },
  {
    icon: TreePalm,
    title: "Private Beach Access",
    description:
      "Rare private beach access just two homes from the ocean. Enjoy pristine Palm Beach shores.",
  },
  {
    icon: UtensilsCrossed,
    title: "Chef's Kitchen & Summer Kitchen",
    description:
      "Open chef's kitchen indoors plus a fully equipped summer kitchen for outdoor entertaining.",
  },
  {
    icon: Sun,
    title: "Solar Powered",
    description:
      "Sustainable living with integrated solar panels and energy-efficient design throughout.",
  },
  {
    icon: Home,
    title: "Indoor-Outdoor Living",
    description:
      "Great room, covered patio, and upper balconies blur the line between inside and out.",
  },
  {
    icon: Music,
    title: "Whole-Home Sound System",
    description:
      "Integrated sound system throughout the property for seamless entertainment.",
  },
  {
    icon: Car,
    title: "Two-Car Garage",
    description:
      "Spacious two-car garage with additional secure storage space.",
  },
  {
    icon: Sparkles,
    title: "Premium Finishes",
    description:
      "Terrazzo and wood floors, impact glass windows, ample closets, and luxury details.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Amenities & Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Everything for the Perfect Stay
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            This award-winning residence combines architectural excellence with 
            modern amenities for an unparalleled Palm Beach experience.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
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
    </section>
  );
}
