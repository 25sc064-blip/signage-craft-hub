import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, CreditCard, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, payments: 0, customers: 0 });

  useEffect(() => {
    const load = async () => {
      const [p, o, pay, c] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count || 0,
        orders: o.count || 0,
        payments: pay.count || 0,
        customers: c.count || 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: Package },
    { label: "Orders", value: stats.orders, icon: ShoppingCart },
    { label: "Payments", value: stats.payments, icon: CreditCard },
    { label: "Customers", value: stats.customers, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your signage shop</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-6">
            <c.icon className="h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
