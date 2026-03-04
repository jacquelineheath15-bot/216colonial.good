import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-light tracking-[0.2em] uppercase">216 Colonial</h3>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Your luxury vacation rental in the heart of Palm Beach, Florida.
              Experience the perfect blend of comfort and elegance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#property" className="hover:text-background transition-colors">
                  Property
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="#palm-beach" className="hover:text-background transition-colors">
                  Palm Beach
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Rental Agreement
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  House Rules
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>216 Colonial Lane, Palm Beach, FL 33480</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(929) 765-9504</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>jackie@inglewoodridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-background/20" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} 216 Colonial Lane. All rights reserved.</p>
          <p>
            Designed with care for your perfect Palm Beach getaway.
          </p>
        </div>
      </div>
    </footer>
  );
}
