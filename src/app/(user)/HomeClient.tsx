"use client";

import { ProductCard } from "@/components/product";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { type ProductListItem, useProducts } from "@/hooks/useProducts";

type HomeClientProps = {
  initialProducts: ProductListItem[];
};

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts({
    initialProducts,
  });

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">New Products</h1>

      <div className="relative min-h-[600px]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
              priority={index < 10}
            />
          ))}
          {/* Load More(CSR) 로딩 중 기존 목록 아래에 스켈레톤 표시 */}
          {isFetchingNextPage &&
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>
      </div>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="cursor-pointer rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
