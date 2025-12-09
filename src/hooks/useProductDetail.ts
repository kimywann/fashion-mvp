"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product.model";

interface UseProductDetailProps {
  productId: string | string[] | undefined;
}

export const useProductDetail = ({ productId }: UseProductDetailProps) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // size가 문자열인 경우 배열로 파싱
      const parsedData = {
        ...data,
        size: typeof data.size === "string" ? JSON.parse(data.size) : data.size,
      };

      return parsedData as Product;
    },
    enabled: !!productId, // productId가 있을 때만 쿼리 실행
  });
};
