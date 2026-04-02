import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
}

function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setCustomers((data as Profile[]) || []);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-sm text-muted-foreground">View registered customers</p>

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-4 py-3 font-medium">{c.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone_number || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
