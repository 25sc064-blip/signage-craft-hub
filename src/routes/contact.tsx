import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">Get in touch for quotes and enquiries</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {[
              { icon: Phone, label: "Phone", value: "+263 772872970" },
              { icon: Mail, label: "Email", value: "supacrownpvtltd@gmail.com" },
              { icon: MapPin, label: "Address", value: "Zimdef Building, Btwn 9th Ave & 8th Ave, Fort Street, Bulawayo" },
              { icon: Clock, label: "Hours", value: "Mon – Fri: 8am – 5pm, Sat: 8am – 1pm" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 rounded-lg border bg-card p-4">
                <item.icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">Send a Message</h2>
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help?" rows={4} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
