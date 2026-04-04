import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();
  const [whatsapp, setWhatsapp] = useState("+263772872970");

  useEffect(() => {
    supabase.from("shop_settings").select("value").eq("key", "whatsapp_number").maybeSingle().then(({ data }) => {
      if (data?.value) setWhatsapp(data.value);
    });
  }, []);

  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi Supacrown! I'd like to confirm my order:\n\n${items.map((i) => `• ${i.name} x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n")}\n\nTotal: $${total.toFixed(2)}`
  )}`;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-xl border bg-card p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <p className="mt-4 text-lg text-muted-foreground">Your cart is empty</p>
            <Link to="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground opacity-30" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQty(item.id, item.qty - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQty(item.id, item.qty + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Link to="/checkout">
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="mt-2 w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" /> Confirm Order via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
