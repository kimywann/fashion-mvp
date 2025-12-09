"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import {
  OrderSummary,
  DeliveryInfoForm,
  CheckoutItemList,
} from "@/components/checkout";

import { Button } from "@/components/ui";

import { ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { calculateTotalPrice } from "@/utils/price";
import { DeliveryInfoFormData } from "@/components/checkout/DeliveryInfoForm";

import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading } = useCart();

  const checkoutFormId = "checkout-form";

  const user = useSelector((state: RootState) => state.user.user);

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

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

  const handleCheckout = async (formData: DeliveryInfoFormData) => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id, // Redux에서 가져온 user
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        delivery_info: {
          recipient_name: formData.recipientName,
          postal_code: formData.postalCode,
          address: formData.address,
          detail_address: formData.detailAddress,
          phone: formData.phone,
        },
        total_price: calculateTotalPrice(items),
      })
      .select()
      .single();

    if (error) {
      toast.error("주문 실패");
      return;
    }

    router.push(`/checkout/complete?orderId=${data.id}`);
  };

  // 로그인하지 않은 경우 아무것도 렌더링하지 않음
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium text-gray-400">장바구니</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium">주문/결제</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium text-gray-400">주문완료</span>
      </div>

      <hr className="my-4 w-full" />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* 왼쪽: 배송 정보 및 주문 상품 (2/3) */}
        <section className="flex w-full flex-col gap-8 lg:w-2/3">
          {/* 배송 정보 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">배송 정보</h2>
            <DeliveryInfoForm
              onSubmit={handleCheckout}
              formId={checkoutFormId}
            />
          </div>

          {/* 주문 상품 */}
          <CheckoutItemList items={items} />
        </section>

        {/* 오른쪽: 결제 요약 (1/3) */}
        <section className="w-full lg:w-1/3">
          <OrderSummary items={items}>
            <Button
              className="mt-4 w-full cursor-pointer"
              type="submit"
              form={checkoutFormId}
            >
              결제하기
            </Button>
          </OrderSummary>
        </section>
      </div>
    </div>
  );
}
