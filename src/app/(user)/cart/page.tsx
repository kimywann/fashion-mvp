"use client";

import { useRouter } from "next/navigation";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateItemQuantity } from "@/store/slices/cartSlice";

import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CartList } from "@/components/checkout/CartList";
import { ChevronRight } from "lucide-react";
import { useCartSource } from "@/hooks/useCartSource";
import { Button } from "@/components/ui";
import {
  useUpdateCartItemQuantity,
  useRemoveCartItem,
} from "@/hooks/useCartMutations";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 통합 장바구니 Hook (로그인/비로그인 자동 처리)
  const { items: products, isLoading, source } = useCartSource();
  const user = useSelector((state: RootState) => state.user.user);

  // 서버 장바구니 mutations (낙관적 업데이트)
  const updateQuantityMutation = useUpdateCartItemQuantity(user?.id);
  const removeItemMutation = useRemoveCartItem(user?.id);

  const handleQuantityChange = async (
    productId: number,
    selectedSize: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return; // 수량이 1 미만이면 무시
    }

    if (source === "server") {
      // 로그인: TanStack Query mutation (낙관적 업데이트)
      updateQuantityMutation.mutate({
        productId,
        selectedSize,
        quantity: newQuantity,
      });
    } else {
      // 비로그인: Redux로 로컬 업데이트
      dispatch(
        updateItemQuantity({ productId, selectedSize, quantity: newQuantity })
      );
    }
  };

  const handleRemoveItem = async (productId: number, selectedSize: string) => {
    if (source === "server") {
      // 로그인: TanStack Query mutation (낙관적 삭제)
      removeItemMutation.mutate({ productId, selectedSize });
    } else {
      // 비로그인: Redux로 로컬 삭제
      dispatch(removeItem({ productId, selectedSize }));
    }
  };

  const handleGoToCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 text-lg lg:text-2xl">
        <span className="font-medium">장바구니</span>
        <ChevronRight className="text-gray-400" />
        <span className="font-medium text-gray-400">주문/결제</span>
        <ChevronRight className="text-gray-400" />
        <span className="font-medium text-gray-400">주문완료</span>
      </div>

      <hr className="my-4 w-full lg:w-2/3" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-xl text-gray-500">장바구니를 불러오는 중...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-xl text-gray-500">장바구니가 비어있습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* 장바구니 목록 */}
          <CartList
            products={products}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
          />

          {/* 결제 요약 */}
          <section className="w-full lg:w-1/3">
            <OrderSummary items={products}>
              <Button
                className="mt-4 w-full cursor-pointer"
                onClick={handleGoToCheckout}
              >
                주문하기
              </Button>
            </OrderSummary>
          </section>
        </div>
      )}
    </div>
  );
}
