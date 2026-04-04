import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    setPayments((data as Payment[]) || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("payments").update({ status }).eq("id", id);
    load();
  };

  const viewProof = async (path: string) => {
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 300);
    if (data?.signedUrl) setProofUrl(data.signedUrl);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Payments</h1>
      <p className="text-sm text-muted-foreground">Verify EcoCash payment proofs</p>

      <Dialog open={!!proofUrl} onOpenChange={() => setProofUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Payment Proof</DialogTitle>
          {proofUrl && <img src={proofUrl} alt="Payment proof" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>

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
                    p.status === "verified" ? "bg-green-100 text-green-700" :
                    p.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-xs">{p.reference_number || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {p.proof_image_url && (
                      <Button variant="ghost" size="sm" onClick={() => viewProof(p.proof_image_url!)}>
                        <Eye className="mr-1 h-4 w-4" /> Proof
                      </Button>
                    )}
                    {p.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(p.id, "verified")}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(p.id, "rejected")}>
                          <XCircle className="h-4 w-4 text-red-600" />
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
