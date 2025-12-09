import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types/order.model";

/**
 * 사용자의 주문 내역을 조회하는 Query Hook
 * @param userId - 사용자 ID
 */
export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];

      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("id, user_id, items, total_price, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // items 배열 정규화
      return (data ?? []).map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
      })) as Order[];
    },
    enabled: !!userId, // 로그인 상태일 때만 실행
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지 (주문은 자주 변경되지 않음)
    gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
  });
};
