import { Button } from "@/components/ui";
import Image from "next/image";
import React from "react";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽: 상품 이미지 섹션 */}
        <section className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={`/images/sample.jpg`}
              alt={`Product ${id}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* 오른쪽: 상품 정보 섹션 */}
        <section className="flex flex-col">
          <div className="flex h-full w-full flex-col gap-4 rounded-md p-6">
            <p className="text-2xl font-bold text-gray-700">Product ID: {id}</p>
            <p className="text-gray-700">가격</p>
            <p className="text-gray-700">사이즈</p>
            <Button className="h-12 w-full cursor-pointer">색상 선택</Button>
            <p className="text-gray-700">상품 설명</p>
          </div>
          <div>
            <Button className="h-12 w-full cursor-pointer">구매하기</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
