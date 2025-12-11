import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cart-item.model";

interface MergeCartResult {
  success: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
}

/**
 * 로컬 장바구니 아이템을 서버(Supabase)에 병합합니다.
 * 서버에 이미 같은 상품이 있으면 수량을 합산합니다.
 * @param userId - 사용자 ID
 * @param cartItems - Redux store에서 가져온 장바구니 아이템 배열
 * @returns 병합 결과 (성공 여부, 전체/성공/실패 개수)
 */
const mergeLocalCartToServer = async (
  userId: string,
  cartItems: CartItem[]
): Promise<MergeCartResult> => {
  const supabase = createClient();

  // 장바구니가 비어있는 경우
  if (!cartItems || cartItems.length === 0) {
    return {
      success: true,
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
    };
  }

  try {
    // 1. 서버 장바구니 조회
    const { data: existingCart, error: fetchError } = await supabase
      .from("cart")
      .select("product_id, size, quantity")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("서버 장바구니 조회 오류:", fetchError);
      return {
        success: false,
        totalCount: cartItems.length,
        successCount: 0,
        failedCount: cartItems.length,
      };
    }

    // 2. 서버 장바구니를 Map으로 변환 (빠른 조회를 위해)
    // 키: "product_id:size", 값: quantity
    const existingCartMap = new Map<string, number>();

    existingCart?.forEach((item) => {
      const key = `${item.product_id}:${item.size}`;
      existingCartMap.set(key, item.quantity);
    });

    // 3. 각 로컬 아이템에 대해 서버 수량과 합산하여 upsert
    const results = await Promise.allSettled(
      cartItems.map((item) => {
        const key = `${item.id}:${item.selectedSize}`;
        const existingQuantity = existingCartMap.get(key) || 0;
        const mergedQuantity = existingQuantity + item.quantity;

        return supabase
          .from("cart")
          .upsert(
            {
              user_id: userId,
              product_id: item.id,
              quantity: mergedQuantity, // 합산된 수량 사용
              size: item.selectedSize,
            },
            {
              onConflict: "user_id,product_id,size",
            }
          )
          .select();
      })
    );

    // 결과 집계
    const successResults = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    // 실패한 아이템 로깅
    failedResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const item = cartItems[index];
        console.error(
          `아이템 업로드 실패 (product_id: ${item.id}, size: ${item.selectedSize}):`,
          result.reason
        );
      }
    });

    const mergeResult: MergeCartResult = {
      success: failedResults.length === 0,
      totalCount: cartItems.length,
      successCount: successResults.length,
      failedCount: failedResults.length,
    };

    console.log("장바구니 병합 완료:", mergeResult);

    return mergeResult;
  } catch (error) {
    console.error("장바구니 병합 중 예상치 못한 오류 발생:", error);
    return {
      success: false,
      totalCount: cartItems.length,
      successCount: 0,
      failedCount: cartItems.length,
    };
  }
};

export { mergeLocalCartToServer };
export type { MergeCartResult };
