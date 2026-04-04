import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
});

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  image_url: string | null;
}

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()
      .then(({ data }) => {
        setProduct(data as Product | null);
        setLoading(false);
      });
  }, [productId]);

  const nav = useNavigate();

  const handleAddToCart = async () => {
    if (!product) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to add items to your cart");
      nav({ to: "/login" });
      return;
    }
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-muted">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-20 w-20 text-muted-foreground opacity-20" />
              </div>
            )}
          </div>
          <div>
            {product.category && (
              <span className="text-sm font-medium text-primary">{product.category}</span>
            )}
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
            <div className="mt-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${product.stock_quantity > 0 ? "text-success" : "text-destructive"}`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of Stock"}
              </span>
            </div>
            <div className="mt-8 flex gap-3">
              <Button size="lg" disabled={product.stock_quantity === 0} onClick={handleAddToCart} className="w-full sm:w-auto">
                {added ? <><Check className="mr-2 h-4 w-4" /> Added!</> : <><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>}
              </Button>
              <Link to="/cart">
                <Button size="lg" variant="outline">View Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
