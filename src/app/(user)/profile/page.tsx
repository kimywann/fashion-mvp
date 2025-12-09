"use client";

import { OrderHistoryList } from "@/components/profile/OrderHistoryList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useOrders } from "@/hooks/useOrders";
import { Spinner } from "@/components/ui";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: orders = [], isLoading, error } = useOrders(user?.id);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg font-semibold">
          로그인 후 주문 내역을 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium">마이페이지</span>
      </div>

      <hr className="my-4 w-full" />

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">주문 내역</h2>

        {/* 로딩 상태 */}
        {isLoading && <Spinner className="mx-auto size-20" />}

        {/* 에러 상태 */}
        {error && (
          <p className="text-sm text-red-500">
            주문 내역을 불러오는데 실패했습니다.
          </p>
        )}

        {/* 데이터 표시 */}
        {!isLoading &&
          !error &&
          (orders.length === 0 ? (
            <p className="text-sm">주문 내역이 없습니다.</p>
          ) : (
            <OrderHistoryList orders={orders} />
          ))}
      </div>
    </div>
  );
}
