import type { CartItem } from "@/types/cart-item.model";

/**
 * 장바구니 아이템들의 총 금액을 계산합니다
 * @param items - 장바구니 아이템 배열
 * @returns 총 금액
 */
export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * 개별 아이템의 소계를 계산합니다
 * @param item - 장바구니 아이템
 * @returns 소계 (가격 × 수량)
 */
export const calculateItemSubtotal = (item: CartItem): number => {
  return item.price * item.quantity;
};

/**
 * 총 상품 개수를 계산합니다
 * @param items - 장바구니 아이템 배열
 * @returns 총 개수
 */
export const calculateTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};
