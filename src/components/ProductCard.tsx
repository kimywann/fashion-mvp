import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  return (
    <div className="rounded-xl transition hover:scale-105">
      <Link href={`/product/${id}`} className="block">
        {/* 상단 이미지 영역 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* 아래 텍스트 */}
        <div className="p-3">
          <h3 className="truncate text-sm font-medium text-gray-900">{name}</h3>

          <p className="mt-1 text-xl font-bold text-gray-800">
            {price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
