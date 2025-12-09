import { Order } from "@/types/order.model";

interface OrderHistoryListProps {
  orders: Order[];
}

const currencyFormatter = new Intl.NumberFormat("ko-KR");
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const OrderHistoryList = ({ orders }: OrderHistoryListProps) => {
  if (!orders.length) {
    return <p className="text-gray-500">아직 주문 내역이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">주문일자</p>
              <p className="text-lg font-semibold">
                {dateFormatter.format(new Date(order.created_at))}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="mr-2">총 결제 금액</span>
              <span className="text-lg font-bold text-gray-900">
                {currencyFormatter.format(order.total_price)}원
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={`${order.id}-${item.id}-${item.selectedSize ?? "default"}`}
                  className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.selectedSize
                        ? `사이즈: ${item.selectedSize}`
                        : "사이즈 정보 없음"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>수량: {item.quantity}개</p>
                    <p className="text-base font-semibold text-gray-900">
                      {currencyFormatter.format(item.price * item.quantity)}원
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                이 주문에는 상품 정보가 없습니다.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
