"use client";

import { ProductCard } from "@/components/product";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui";

export default function Home() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="size-20" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">New Products</h1>
      {products?.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner className="size-20" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products?.map((product) => (
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
