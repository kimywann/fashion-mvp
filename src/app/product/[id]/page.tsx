"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { Product } from "@/types";

const supabase = createClient();

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      // size가 문자열인 경우 배열로 파싱
      if (data) {
        const parsedData = {
          ...data,
          size:
            typeof data.size === "string" ? JSON.parse(data.size) : data.size,
        };
        setProduct(parsedData);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>로딩 중...</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽: 상품 이미지 섹션 */}
        <section className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={product.image_url}
              alt="상품 이미지"
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
            <p className="text-gray-700">{product.price.toLocaleString()}</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <section className="flex flex-col gap-2">
            <div>
              <Select>
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
                onClick={() => console.log("구매하기")}
              >
                구매하기
              </Button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
