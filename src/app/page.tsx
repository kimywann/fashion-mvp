"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product";
import { Spinner } from "@/components/ui";
import { toast } from "sonner";
import type { Product } from "@/types";

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
    <div className="container">
      <h1 className="mb-6 text-2xl font-bold">New Products</h1>
      {products.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner className="size-20" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
