"use client";

import { useState } from "react";
import { useAddCartItem } from "@/hooks/useCartMutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addItem } from "@/store/slices/cartSlice";

import { toast } from "sonner";

import type { CartItem } from "@/types/cart-item.model";
import type { Product } from "@/types/product.model";

export const useAddToCart = () => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

  // 로그인 사용자용 mutation
  const addCartMutation = useAddCartItem(user?.id);

  const addToCart = async (product: Product, selectedSize: string) => {
    // Early return: 상품 데이터가 없는 경우
    if (!product) {
      toast.error("상품 정보를 가져올 수 없습니다.");
      return;
    }

    // Early return: 사이즈 미선택
    if (!selectedSize) {
      toast.error("사이즈를 선택해 주세요.");
      return;
    }

    setIsAddingToCart(true);

    try {
      if (!user?.id) {
        // 비로그인: Redux에 로컬 저장
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          selectedSize,
          quantity: 1,
        };

        dispatch(addItem(cartItem));
        toast.success("장바구니에 추가되었습니다.");
      } else {
        // 로그인: TanStack Query mutation (캐시 자동 업데이트)
        await addCartMutation.mutateAsync({
          productId: product.id,
          selectedSize,
        });
        toast.success("장바구니에 추가되었습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "장바구니 저장 중 오류가 발생했습니다."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return {
    addToCart,
    isAddingToCart: isAddingToCart || addCartMutation.isPending,
  };
};
