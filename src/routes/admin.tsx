import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, ShoppingCart, CreditCard, Settings, Users, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) { navigate({ to: "/dashboard" }); return; }
      setIsAdmin(true);
      setLoading(false);
    };
    check();
  }, [navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!isAdmin) return null;

  const links = [
    { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products" as const, label: "Products", icon: Package },
    { to: "/admin/orders" as const, label: "Orders", icon: ShoppingCart },
    { to: "/admin/payments" as const, label: "Payments", icon: CreditCard },
    { to: "/admin/customers" as const, label: "Customers", icon: Users },
    { to: "/admin/settings" as const, label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-sidebar px-4 md:hidden">
        <span className="text-sm font-bold text-sidebar-foreground">Admin Panel</span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sidebar-foreground">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r bg-sidebar transition-transform md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarOpen ? "pt-14 md:pt-0" : ""}`}>
        <div className="hidden h-14 items-center border-b border-sidebar-border px-4 md:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-sidebar-primary">
              <span className="text-xs font-bold text-sidebar-primary-foreground">S</span>
            </div>
            <span className="text-sm font-bold text-sidebar-foreground">Supacrown Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
              activeOptions={{ exact: link.to === "/admin" }}
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 pt-14 md:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
