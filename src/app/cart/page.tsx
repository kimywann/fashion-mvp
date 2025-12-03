"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui";
import { ChevronRight } from "lucide-react";

import { OrderSummary } from "@/components/OrderSummary";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateItemQuantity } from "@/store/slices/cartSlice";
import { RootState } from "@/store";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux store에서 장바구니 아이템 가져오기
  const products = useSelector((state: RootState) => state.cart.items);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // 수량이 0 이하가 되면 아이템 제거
      dispatch(removeItem(productId));
      return;
    }

    // Redux 액션으로 수량 업데이트
    dispatch(updateItemQuantity({ id: productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeItem(productId));
  };

  const handleGoToCheckout = () => {
    if (products.length === 0) {
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium">장바구니</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium text-gray-400">주문/결제</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium text-gray-400">주문완료</span>
      </div>

      <hr className="my-4 w-2/3" />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-xl text-gray-500">장바구니가 비어있습니다.</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* 장바구니 목록 */}
          <section className="flex w-2/3">
            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <div
                  key={`${product.id}-${product.selectedSize}`}
                  className="flex gap-20"
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">{product.name}</p>
                    <p>사이즈: {product.selectedSize}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                      >
                        –
                      </Button>

                      <span className="w-8 text-center">
                        {product.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(product.id)}
                    className="w-fit cursor-pointer bg-red-400 font-bold text-white hover:bg-red-500 hover:text-white"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <OrderSummary
            items={products}
            buttonText="주문하기"
            onAction={handleGoToCheckout}
          />
        </div>
      )}
    </div>
  );
}
