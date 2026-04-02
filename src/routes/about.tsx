import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Award, Users, MapPin } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold">About Supacrown</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Supacrown Pvt Ltd is a professional signage company based in Bulawayo, Zimbabwe.
          We specialize in creating high-quality signage solutions for businesses of all sizes.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { icon: Award, title: "Quality First", desc: "Every sign we produce meets our rigorous quality standards." },
            { icon: Users, title: "Customer Focus", desc: "We work closely with clients to deliver exactly what they envision." },
            { icon: MapPin, title: "Local Expertise", desc: "Deep roots in Bulawayo, serving businesses across Zimbabwe." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border bg-card p-6">
              <item.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-muted p-8">
          <h2 className="text-2xl font-bold">Our Services</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            {[
              "Shop Front Signage", "Vehicle Wraps & Branding", "Banners & Posters",
              "Illuminated Signs", "Safety Signage", "Event Branding",
              "Business Cards & Stationery", "Custom Displays",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PublicLayout>
  );
}
