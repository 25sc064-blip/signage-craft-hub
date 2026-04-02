import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  // Cart will be managed via local state for now (can move to context/zustand later)
  const [items] = useState<Array<{ id: string; name: string; price: number; qty: number }>>([]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-xl border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Link to="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon"><Minus className="h-3 w-3" /></Button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <Button variant="outline" size="icon"><Plus className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">
                ${items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
              </span>
            </div>
            <Link to="/checkout">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
