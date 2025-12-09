"use client";

import { Button } from "@/components/ui";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompletePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium text-gray-400">장바구니</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium text-gray-400">주문/결제</span>
        <ChevronRight className="text-gray-400" />
        <span className="text-2xl font-medium">주문완료</span>
      </div>

      <hr className="my-4 w-full" />

      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold">주문이 완료되었습니다.</h1>
        <p className="text-lg text-gray-500">
          주문 내역을 확인하시려면 마이페이지로 이동해주세요.
        </p>
        <div className="mt-10 flex w-full gap-4">
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            홈으로 이동
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            variant="outline"
            onClick={() => (window.location.href = "/profile")}
          >
            마이페이지로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
