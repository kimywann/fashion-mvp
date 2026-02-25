import { createClient } from "@/lib/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product.model";

export const PAGE_SIZE = 10;

export type ProductListItem = Pick<
  Product,
  "id" | "name" | "price" | "image_url"
>;

type UseProductsOptions = {
  initialProducts?: ProductListItem[];
};

export const useProducts = ({ initialProducts }: UseProductsOptions = {}) => {
  const supabase = createClient();

  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, pageParam * PAGE_SIZE + PAGE_SIZE - 1);

      if (error) {
        throw new Error(error.message);
      }

      return {
        items: data as ProductListItem[],
        nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    // SSR에서 받아온 첫 페이지 데이터를 초기값으로 주입 → 클라이언트에서 중복 fetch 방지
    initialData: initialProducts
      ? {
          pages: [
            {
              items: initialProducts,
              nextPage: initialProducts.length === PAGE_SIZE ? 1 : null,
            },
          ],
          pageParams: [0],
        }
      : undefined,
  });
};
