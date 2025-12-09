"use client";

import type { CartItem } from "@/types/cart-item.model";
import { calculateTotalPrice } from "@/utils/price";

interface OrderSummaryProps {
  items: CartItem[];
  className?: string;
  children?: React.ReactNode;
}

export const OrderSummary = ({
  items,
  className = "",
  children,
}: OrderSummaryProps) => {
  return (
    <section className={`flex w-full flex-col gap-4 ${className}`}>
      <div className="flex justify-between">
        <p className="text-lg font-bold">총 상품 금액</p>
        <p className="text-lg font-bold">
          {calculateTotalPrice(items).toLocaleString()}원
        </p>
      </div>
      {children}
    </section>
  );
};
