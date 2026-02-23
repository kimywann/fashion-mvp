export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 이미지 영역 */}
        <section className="flex flex-col gap-4">
          <div className="relative aspect-square w-full animate-pulse overflow-hidden rounded-lg bg-gray-200" />
        </section>

        {/* 정보 영역 */}
        <section className="flex flex-col">
          <div className="flex h-full w-full flex-col gap-4 rounded-md p-6">
            {/* 상품명 */}
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-200" />
            {/* 가격 */}
            <div className="h-5 w-1/3 animate-pulse rounded-md bg-gray-200" />
            {/* 설명 */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-4/6 animate-pulse rounded-md bg-gray-200" />
            </div>
          </div>

          {/* 버튼 영역 */}
          <section className="flex flex-col gap-2 px-6">
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
          </section>
        </section>
      </div>
    </div>
  );
}
