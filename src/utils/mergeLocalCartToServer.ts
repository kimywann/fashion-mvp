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
 * @param userId - 사용자 ID
 * @param cartItems - Redux store에서 가져온 장바구니 아이템 배열
 * @returns 병합 결과 (성공 여부, 전체/성공/실패 개수)
 */

const mergeLocalCartToServer = async (
  userId: string,
  cartItems: CartItem[]
): Promise<MergeCartResult> => {
  const supabase = createClient();

  // Early return: 장바구니가 비어있는 경우
  if (!cartItems || cartItems.length === 0) {
    return {
      success: true,
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
    };
  }

  try {
    // 병렬 처리로 모든 아이템 업로드
    const results = await Promise.allSettled(
      cartItems.map((item) =>
        supabase
          .from("cart")
          .upsert(
            {
              user_id: userId,
              product_id: item.id,
              quantity: item.quantity,
              size: item.selectedSize,
            },
            {
              onConflict: "user_id,product_id,size",
            }
          )
          .select()
      )
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
