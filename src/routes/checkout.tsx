import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Upload, CheckCircle, MessageCircle, ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "payment" | "done">("details");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [ecocashNumber, setEcocashNumber] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [whatsapp, setWhatsapp] = useState("+263772872970");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("shop_settings").select("key, value").in("key", ["ecocash_number", "payment_instructions", "whatsapp_number"]).then(({ data }) => {
      (data || []).forEach((s: { key: string; value: string }) => {
        if (s.key === "ecocash_number") setEcocashNumber(s.value);
        if (s.key === "payment_instructions") setPaymentInstructions(s.value);
        if (s.key === "whatsapp_number") setWhatsapp(s.value);
      });
    });
  }, []);

  const handleProofFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      // Create order
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        user_id: user.id,
        total_amount: total,
        delivery_address: address || null,
        notes: notes || null,
        status: "pending",
      }).select("id").single();

      if (orderErr || !order) throw orderErr;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.price,
      }));
      await supabase.from("order_items").insert(orderItems);

      // Upload proof if provided
      let proof_image_url: string | null = null;
      if (proofFile) {
        const ext = proofFile.name.split(".").pop();
        const path = `${user.id}/${order.id}.${ext}`;
        await supabase.storage.from("payment-proofs").upload(path, proofFile);
        // payment-proofs is private, so we store the path
        proof_image_url = path;
      }

      // Create payment record
      await supabase.from("payments").insert({
        order_id: order.id,
        user_id: user.id,
        amount: total,
        method: "ecocash",
        reference_number: reference || null,
        proof_image_url,
        status: "pending",
      });

      setOrderId(order.id);
      clearCart();
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "done") {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
          <Link to="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  if (step === "done") {
    const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Hi Supacrown! I've just placed order #${orderId?.slice(0, 8)}. I've uploaded my EcoCash payment proof. Please confirm my order. Thank you!`
    )}`;

    return (
      <PublicLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Order #{orderId?.slice(0, 8)} has been submitted. We'll verify your payment and confirm your order.
          </p>
          <div className="mt-6 space-y-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full border-green-600 bg-green-600 text-white hover:bg-green-700" size="lg">
                <MessageCircle className="mr-2 h-4 w-4" /> Confirm on WhatsApp
              </Button>
            </a>
            <Link to="/dashboard">
              <Button variant="outline" className="mt-2 w-full" size="lg">View My Orders</Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {/* Order summary */}
        <div className="mt-6 rounded-xl border bg-card p-4">
          <h2 className="font-bold">Order Summary</h2>
          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {step === "details" && (
          <div className="mt-6 space-y-4">
            <div>
              <Label>Delivery Address</Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your delivery address" />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions" />
            </div>
            <Button className="w-full" size="lg" onClick={() => setStep("payment")}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <h3 className="font-bold text-primary">EcoCash Payment</h3>
              {ecocashNumber && (
                <p className="mt-1 text-sm">Send payment to: <strong>{ecocashNumber}</strong></p>
              )}
              {paymentInstructions && (
                <p className="mt-1 text-sm text-muted-foreground">{paymentInstructions}</p>
              )}
              <p className="mt-2 text-sm font-medium">Amount: <strong>${total.toFixed(2)}</strong></p>
            </div>

            <div>
              <Label>EcoCash Reference Number</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. MP123456789" />
            </div>

            <div>
              <Label>Upload Payment Screenshot</Label>
              <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleProofFile} />
              <div
                onClick={() => fileRef.current?.click()}
                className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 transition-colors hover:border-primary"
              >
                {proofPreview ? (
                  <img src={proofPreview} alt="Payment proof" className="max-h-48 rounded-lg object-contain" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload EcoCash screenshot</p>
                  </>
                )}
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleSubmitOrder} disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
