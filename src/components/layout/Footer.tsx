import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-lg font-bold">Supacrown</span>
            </div>
            <p className="mt-3 text-sm opacity-70">
              Professional signage solutions for your business. Quality signs that make an impression.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider opacity-50">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm opacity-70 hover:opacity-100">Products</Link>
              <Link to="/about" className="text-sm opacity-70 hover:opacity-100">About Us</Link>
              <Link to="/contact" className="text-sm opacity-70 hover:opacity-100">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider opacity-50">Contact</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="h-3.5 w-3.5" />
                <span>+263 772872970</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="h-3.5 w-3.5" />
                <span>supacrownpvtltd@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="h-3.5 w-3.5" />
                <span>Zimdef Building, Fort St, Bulawayo</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider opacity-50">Address</h3>
            <p className="text-sm opacity-70">
              Zimdef Building<br />
              Btwn 9th Ave & 8th Ave<br />
              Fort Street, Bulawayo
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-background/20 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Supacrown Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
