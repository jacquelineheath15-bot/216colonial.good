import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const highlights = [
  "Schuler Award for architectural excellence",
  "Rare private beach access - two homes from ocean",
  "Solar panels & sustainable design",
  "Impact glass windows throughout",
  "Locally sourced materials",
  "Heated pool with swim jets & spa",
  "Summer kitchen & covered patio",
  "Lake Trail access with day dock",
];

const stats = [
  { label: "Year Built", value: "2013" },
  { label: "Style", value: "Art Deco" },
  { label: "Garage", value: "2 Cars" },
  { label: "Exposure", value: "Southern" },
];

export function AboutProperty() {
  return (
    <section id="property" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Property Gallery */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="aspect-[4/3] rounded-lg bg-cover bg-center shadow-lg"
              style={{
                backgroundImage: `url('/images/house-exterior.png')`,
              }}
            />
            <div
              className="aspect-[4/3] rounded-lg bg-cover bg-center shadow-lg"
              style={{
                backgroundImage: `url('/images/pool-aerial.png')`,
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              About the Property
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Award-Winning Architecture
              <br />
              on Palm Beach&apos;s North End
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              This outstanding residence, honored with the prestigious Schuler 
              Award for architectural excellence, seamlessly integrates sustainable 
              features including solar panels, impact glass, and locally sourced 
              materials throughout its stunning art deco design.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Nestled on the sought-after North End of Palm Beach, just two homes 
              from the ocean with private beach access, the home epitomizes 
              indoor-outdoor living with its great room, open chef&apos;s kitchen, 
              covered patio, and upper balconies.
            </p>

            <Separator className="my-8" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Property Highlights</h3>
                <ul className="space-y-4">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Bedroom Configuration</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Three ensuite bedrooms plus a flexible fourth bedroom that can 
                  serve as a den or yoga studio. Perfect for families or guests 
                  who appreciate privacy and comfort.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-amber-900">Short-Term Rental</h3>
                <p className="text-amber-800 text-sm">
                  This property is exclusively available for short-term vacation rentals 
                  of 7 days or less. Perfect for a luxurious Palm Beach getaway.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
