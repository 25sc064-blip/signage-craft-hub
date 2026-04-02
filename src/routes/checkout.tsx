import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-muted-foreground">
          Add items to your cart first, then proceed with EcoCash payment.
        </p>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    </PublicLayout>
  );
}
