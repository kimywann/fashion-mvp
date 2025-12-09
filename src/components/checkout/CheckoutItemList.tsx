import Image from "next/image";
import type { CartItem } from "@/types/cart-item.model";

interface CheckoutItemListProps {
  items: CartItem[];
}

export function CheckoutItemList({ items }: CheckoutItemListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">주문 상품</h2>
      <div className="flex flex-col gap-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${item.id}-${item.selectedSize}-${index}`}
              className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="relative h-24 w-24 shrink-0 bg-gray-100">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
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
  );
}
