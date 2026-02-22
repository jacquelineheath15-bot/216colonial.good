import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Waves, Ship, Palmtree } from "lucide-react";

const attractions = [
  {
    icon: Waves,
    title: "Private Beach",
    distance: "Steps away",
    description: "Rare private beach access, just two homes from the ocean.",
  },
  {
    icon: Ship,
    title: "Lake Trail & Day Dock",
    distance: "On property",
    description: "Access to the scenic Lake Trail with your own private day dock.",
  },
  {
    icon: Palmtree,
    title: "Worth Avenue",
    distance: "10 min drive",
    description: "World-famous luxury shopping, dining, and galleries.",
  },
  {
    icon: MapPin,
    title: "PBI Airport",
    distance: "20 min drive",
    description: "Palm Beach International Airport for convenient travel.",
  },
];

export function AboutPalmBeach() {
  return (
    <section id="palm-beach" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-[4/5] rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop')`,
                }}
              />
              <div className="space-y-4">
                <div
                  className="aspect-square rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1548659839-09d3d0f5c10e?q=80&w=500&auto=format&fit=crop')`,
                  }}
                />
                <div
                  className="aspect-square rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=500&auto=format&fit=crop')`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              The Location
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Palm Beach&apos;s Coveted North End
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The North End of Palm Beach is renowned for its tranquil atmosphere, 
              prestigious residences, and unmatched proximity to pristine beaches. 
              This location offers the perfect balance of seclusion and accessibility.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Enjoy great neighbors, the scenic Lake Trail with a private day dock, 
              and the rare privilege of private beach access just steps from your door. 
              This is Palm Beach living at its finest.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {attractions.map((attraction) => (
                <Card key={attraction.title} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <attraction.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{attraction.title}</h4>
                      <p className="text-xs text-primary font-medium">
                        {attraction.distance}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {attraction.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="mt-8" size="lg">
              Explore the Area
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
