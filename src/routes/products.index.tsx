import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
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

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Products</h1>
            <p className="mt-1 text-muted-foreground">Browse our signage catalogue</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {products.length === 0 ? "No products available yet. Check back soon!" : "No products match your search."}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <Link key={product.id} to="/products/$productId" params={{ productId: product.id }}>
                <div className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
                  <div className="aspect-[4/3] bg-muted">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ShoppingCart className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {product.category && (
                      <span className="text-xs font-medium text-primary">{product.category}</span>
                    )}
                    <h3 className="mt-1 text-lg font-bold group-hover:text-primary">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      <span className={`text-xs ${product.stock_quantity > 0 ? "text-success" : "text-destructive"}`}>
                        {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
