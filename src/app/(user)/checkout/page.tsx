"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { OrderSummary } from "@/components/OrderSummary";
import { DeliveryInfoForm } from "@/components/DeliveryInfoForm";
import type { DeliveryInfoFormData } from "@/components/DeliveryInfoForm";

import type { CartItem } from "@/types";
import { ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  // TODO: 실제 장바구니 데이터를 가져오거나 상태 관리에서 가져오기
  const [orderItems] = useState<CartItem[]>([]);
  const router = useRouter();
  // 다음 주소 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCheckout = (deliveryInfo: DeliveryInfoFormData) => {
    console.log("배송 정보:", deliveryInfo);
    // 결제 처리 로직
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium text-gray-400">장바구니</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium">주문/결제</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium text-gray-400">주문완료</span>
      </div>

      <hr className="my-4 w-2/3" />

      <div className="flex gap-4">
        {/* 왼쪽: 배송 정보 및 주문 상품 */}
        <section className="flex w-2/3 flex-col gap-8">
          {/* 배송 정보 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">배송 정보</h2>
            <DeliveryInfoForm onSubmit={handleCheckout} />
          </div>

          {/* 주문 상품 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">주문 상품</h2>
            <div className="flex flex-col gap-4">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-lg font-bold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          사이즈: {item.selectedSize}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          수량: {item.quantity}개
                        </p>
                        <p className="font-bold">
                          {(item.price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">주문할 상품이 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {/* 오른쪽: 결제 요약 */}
        <OrderSummary
          items={orderItems}
          buttonText="결제하기"
          onAction={() => {
            router.push("/checkout/complete");
          }}
        />
      </div>
    </div>
  );
}
