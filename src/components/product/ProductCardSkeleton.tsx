export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-xl">
      {/* 이미지 스켈레톤 */}
      <div className="relative aspect-4/5 w-full animate-pulse overflow-hidden rounded-t-lg bg-gray-200" />

      {/* 텍스트 스켈레톤 */}
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
};
