import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-signage.jpg";
import { ArrowRight, Award, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-background" style={{ minHeight: "500px" }}>
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium text-primary-foreground">
              Professional Signage Solutions
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Signs That Make Your{" "}
              <span className="text-primary-foreground" style={{ color: "oklch(0.65 0.2 305)" }}>
                Business Stand Out
              </span>
            </h1>
            <p className="mt-6 text-lg opacity-80">
              Supacrown delivers premium signage — from shopfronts to vehicle wraps, 
              banners to illuminated signs. Based in Bulawayo, serving all of Zimbabwe.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-background/30 text-foreground bg-background/80 hover:bg-background">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Why Choose Supacrown?</h2>
            <p className="mt-2 text-muted-foreground">Quality signage backed by years of experience</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { icon: Award, title: "Premium Quality", desc: "We use only the finest materials for durable, eye-catching signage that lasts." },
              { icon: Zap, title: "Fast Turnaround", desc: "Quick production and delivery without compromising on quality." },
              { icon: Shield, title: "Trusted Service", desc: "Reliable professionals with a proven track record in Bulawayo and beyond." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">Ready to Get Started?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Browse our catalogue or get in touch for custom signage solutions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">Create Account</Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Find Us</h2>
              <p className="mt-2 text-muted-foreground">Visit our shop in Bulawayo</p>
              <div className="mt-6 space-y-3 text-sm">
                <p><strong>Address:</strong> Zimdef Building, Btwn 9th Ave & 8th Ave, Fort Street, Bulawayo</p>
                <p><strong>Phone:</strong> +263 772872970</p>
                <p><strong>Email:</strong> supacrownpvtltd@gmail.com</p>
                <p><strong>Alt Email:</strong> chrissales@gmail.com</p>
              </div>
              <a
                href="https://www.google.com/maps?q=-20.1325,28.6265"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <iframe
                title="Supacrown Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d28.6265!3d-20.1325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2szw!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
