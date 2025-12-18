import { createClient } from "@/lib/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product.model";

const PAGE_SIZE = 40;

export const useProducts = () => {
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
        items: data as Product[],
        nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
