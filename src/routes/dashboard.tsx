import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, CreditCard, Bell, User } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function DashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState<{ full_name: string; phone_number: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const [ordersRes, notifRes, profileRes] = await Promise.all([
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("profiles").select("full_name, phone_number").eq("user_id", user.id).single(),
      ]);

      setOrders((ordersRes.data as Order[]) || []);
      setNotifications((notifRes.data as Notification[]) || []);
      setProfile(profileRes.data as { full_name: string; phone_number: string } | null);
      setLoading(false);
    };
    init();
  }, [navigate]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}
          </div>
        </div>
      </PublicLayout>
    );
  }

  const statusColor: Record<string, string> = {
    pending: "bg-warning/20 text-warning-foreground",
    confirmed: "bg-primary/20 text-primary",
    processing: "bg-primary/20 text-primary",
    ready: "bg-success/20 text-success",
    delivered: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || "Customer"}</h1>
            <p className="text-sm text-muted-foreground">{profile?.phone_number}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <Package className="h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <CreditCard className="h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">
              ${orders.reduce((s, o) => s + Number(o.total_amount), 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <Bell className="h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">{notifications.filter((n) => !n.is_read).length}</p>
            <p className="text-sm text-muted-foreground">Unread Notifications</p>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold">Notifications</h2>
            <div className="mt-3 space-y-2">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={`rounded-lg border p-3 ${n.is_read ? "opacity-60" : "bg-accent"}`}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        <div className="mt-8">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="mt-4 rounded-xl border bg-card p-8 text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <Link to="/products">
                <Button className="mt-4">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">${Number(order.total_amount).toFixed(2)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
