import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: string;
  proof_image_url: string | null;
  reference_number: string | null;
  created_at: string;
}

function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const load = async () => {
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    setPayments((data as Payment[]) || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("payments").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Payments</h1>
      <p className="text-sm text-muted-foreground">Verify EcoCash payment proofs</p>

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Method</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Ref</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3 font-mono text-xs">{p.order_id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-right">${Number(p.amount).toFixed(2)}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === "verified" ? "bg-success/20 text-success" :
                    p.status === "rejected" ? "bg-destructive/20 text-destructive" :
                    "bg-warning/20 text-warning-foreground"
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-xs">{p.reference_number || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {p.proof_image_url && (
                      <a href={p.proof_image_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">Proof</Button>
                      </a>
                    )}
                    {p.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(p.id, "verified")}>
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(p.id, "rejected")}>
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
