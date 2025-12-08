import { useSelector } from "react-redux";
import { useServerCart } from "./useServerCart";
import type { RootState } from "@/store";

/**
 * 로그인/비로그인 상태를 통합하는 장바구니 Hook
 *
 * - 비로그인: Redux persist에서 로컬 장바구니 사용
 * - 로그인: TanStack Query에서 서버 장바구니 사용
 */

export const useCart = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const localCart = useSelector((state: RootState) => state.cart.items);

  // 로그인 상태일 때만 서버에서 장바구니 조회
  const {
    data: serverCart,
    isLoading,
    error,
    refetch,
  } = useServerCart(user?.id);

  return {
    // 로그인: 서버 데이터, 비로그인: 로컬 데이터
    items: user ? (serverCart ?? []) : localCart,
    isLoading: user ? isLoading : false,
    error: user ? error : null,
    isServerCart: !!user,
    refetch: user ? refetch : undefined,
  };
};
