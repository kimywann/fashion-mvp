"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url");

      if (error) {
        toast.error(error.message || "상품 데이터를 가져오는데 실패했습니다.");
        return;
      }

      if (data) {
        setProducts(data as Product[]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">New Products</h1>
      {products.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
