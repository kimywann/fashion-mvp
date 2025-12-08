"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useAddToCart } from "@/hooks/useAddToCart";
import Image from "next/image";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/ui";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [selectedSize, setSelectedSize] = useState<string>("");

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProductDetail({ productId });

  const { addToCart, isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="size-20" />
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">
          상품 정보를 불러오는데 실패했습니다.
        </p>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : "알 수 없는 오류"}
        </p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    );
  }

  // 상품 데이터가 없는 경우
  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-gray-600">상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽: 상품 이미지 섹션 */}
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

        {/* 오른쪽: 상품 정보 섹션 */}
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
                  {product.size?.map((size) => (
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
