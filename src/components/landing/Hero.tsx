import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Waves, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-16">
      <div className="absolute inset-0 pt-16">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%), url('/hero-house.png')`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-40">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-foreground">
            <Award className="h-3 w-3 mr-1 text-amber-600" />
            Schuler Award Winner
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            An Art Deco
            <br />
            <span className="text-white/90">Jewel Box</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-xl">
            Built in 2013 with rare private beach access. This outstanding 
            residence on the sought-after North End of Palm Beach epitomizes 
            indoor-outdoor living, just two homes from the ocean.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-white">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span className="text-sm font-medium">3+1 Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span className="text-sm font-medium">3 Ensuite Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              <span className="text-sm font-medium">Private Beach Access</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">North End, Palm Beach</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base bg-black hover:bg-black/90" asChild>
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
