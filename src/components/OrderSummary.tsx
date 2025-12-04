"use client";

import { Button } from "@/components/ui";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  buttonText: string;
  onAction: () => void;
  className?: string;
}

export function OrderSummary({
  items,
  buttonText,
  onAction,
  className = "",
}: OrderSummaryProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className={`flex w-full flex-col gap-4 ${className}`}>
      <div className="flex justify-between">
        <p className="text-lg font-bold">총 상품 금액</p>
        <p className="text-lg font-bold">{totalAmount.toLocaleString()}원</p>
      </div>
      <Button className="mt-4 cursor-pointer" onClick={onAction}>
        {buttonText}
      </Button>
    </section>
  );
}
