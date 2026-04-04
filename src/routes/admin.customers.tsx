import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
  is_blocked: boolean;
}

function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  const fetchCustomers = () => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setCustomers((data as Profile[]) || []);
    });
  };

  useEffect(() => { fetchCustomers(); }, []);

  const toggleBlock = async (profile: Profile) => {
    const newVal = !profile.is_blocked;
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: newVal })
      .eq("id", profile.id);
    if (error) {
      toast.error("Failed to update");
      return;
    }
    toast.success(newVal ? "Account blocked" : "Account unblocked");
    setCustomers((prev) => prev.map((c) => c.id === profile.id ? { ...c, is_blocked: newVal } : c));
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.phone_number || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-sm text-muted-foreground">View and manage registered customers</p>

      <div className="mt-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-4 py-3 font-medium">{c.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone_number || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {c.is_blocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <Ban className="h-3 w-3" /> Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant={c.is_blocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => toggleBlock(c)}
                  >
                    {c.is_blocked ? "Unblock" : "Block"}
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
