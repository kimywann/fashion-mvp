import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "@/utils/fetchCart";

/**
 * 서버에서 장바구니 데이터를 조회하는 Query Hook
 * @param userId - 사용자 ID (로그인 상태일 때만)
 */
export const useServerCart = (userId?: string) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId, // 로그인 상태일 때만 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
  });
};
