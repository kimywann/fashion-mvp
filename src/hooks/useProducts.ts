import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types";

export const useProducts = () => {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url");

      if (error) {
        throw new Error(error.message);
      }

      return data as Product[];
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
  });
};
