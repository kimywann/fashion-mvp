import { useSelector } from "react-redux";
import { useServerCart } from "./useServerCart";
import type { RootState } from "@/store";

/**
 * 로그인/비로그인 상태를 통합하는 장바구니 Hook
 *
 * - 비로그인: Redux persist에서 로컬 장바구니 사용
 * - 로그인: TanStack Query에서 서버 장바구니 사용
 */

/** 장바구니 데이터 소스 타입 */
export type CartSource = "server" | "local";

export const useCartSource = () => {
  // Redux 상태 조회
  const user = useSelector((state: RootState) => state.user.user);
  const localItems = useSelector((state: RootState) => state.cart.items);

  // 서버 장바구니 훅 (user.id가 없으면 요청하지 않음)
  const {
    data: serverItems,
    isLoading,
    error,
    refetch,
  } = useServerCart(user?.id);

  // 로그인 여부로 데이터 소스 결정
  const source: CartSource = user ? "server" : "local";

  // 소스에 따라 상태 구성
  return source === "server"
    ? {
        items: serverItems ?? [],
        isLoading,
        error,
        refetch,
        source,
      }
    : {
        items: localItems,
        isLoading: false,
        error: null,
        refetch: undefined,
        source,
      };
};