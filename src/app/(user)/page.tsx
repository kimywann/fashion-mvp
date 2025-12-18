"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product";
import { Spinner } from "@/components/ui";

export default function Home() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts();

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">New Products</h1>

      <div className="relative min-h-[600px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
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

      {!isLoading && hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
