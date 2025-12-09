import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cart-item.model";

/**
 * DB에서 사용자의 장바구니를 조회하고 CartItem 형식으로 변환합니다.
 * @param userId - 사용자 ID
 * @returns CartItem 배열
 */
export const fetchCart = async (userId: string): Promise<CartItem[]> => {
  const supabase = createClient();

  try {
    // 1. cart 테이블에서 사용자의 장바구니 조회
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (cartError) {
      console.error("장바구니 조회 오류:", cartError);
      return [];
    }

    if (!cartData || cartData.length === 0) {
      return [];
    }

    // 2. products 테이블에서 상품 정보 조회
    const productIds = cartData.map((item) => item.product_id);
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .in("id", productIds);

    if (productsError) {
      console.error("상품 정보 조회 오류:", productsError);
      return [];
    }

    if (!productsData) {
      return [];
    }

    // 3. CartItem 형식으로 변환
    const cartItems: CartItem[] = cartData
      .map((cartItem) => {
        const product = productsData.find((p) => p.id === cartItem.product_id);
        if (!product) return null;

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          selectedSize: cartItem.size,
          quantity: cartItem.quantity,
        };
      })
      .filter((item): item is CartItem => item !== null);

    return cartItems;
  } catch (error) {
    console.error("장바구니 조회 중 예상치 못한 오류:", error);
    return [];
  }
};
