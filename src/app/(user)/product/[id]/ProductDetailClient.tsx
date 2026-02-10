"use client";

import { useState } from "react";
import Image from "next/image";
import { useAddToCart } from "@/hooks/useAddToCart";
import type { Product } from "@/types/product.model";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { addToCart, isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={product.image_url}
              alt={product.name || "상품 이미지"}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="flex flex-col">
          <div className="flex h-full w-full flex-col gap-4 rounded-md p-6">
            <p className="text-2xl font-bold text-gray-700">{product.name}</p>
            <p className="text-gray-700">{product.price.toLocaleString()}원</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <section className="flex flex-col gap-2">
            <div>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="!h-12 w-full">
                  <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  {product.size?.map((size: string) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                className="h-12 w-full cursor-pointer"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "추가 중..." : "구매하기"}
              </Button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
