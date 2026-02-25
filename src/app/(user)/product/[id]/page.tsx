import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import type { Product } from "@/types/product.model";
import ProductDetailClient from "./ProductDetailClient";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

export const revalidate = 60;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const toAbsoluteUrl = (value: string) => {
  try {
    return new URL(value).toString();
  } catch {
    return new URL(value, SITE_URL).toString();
  }
};

const parseSize = (size: Product["size"] | string | null) => {
  if (Array.isArray(size)) return size;
  if (typeof size !== "string") return [];

  try {
    const parsed = JSON.parse(size);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// 빌드 타임에 전체 상품 ID를 가져와 정적 페이지 사전 생성
export async function generateStaticParams() {
  const supabase = createPublicServerClient();
  const { data } = await supabase.from("products").select("id");
  return (data ?? []).map((p) => ({ id: String(p.id) }));
}

const getProductById = cache(async (id: string) => {
  const productId = id.trim();
  if (!productId) return null;

  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !data) return null;

  return {
    ...(data as Product),
    size: parseSize(data.size),
  };
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
      description: "요청한 상품 정보를 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productUrl = `/product/${product.id}`;
  const description = product.description || `${product.name} 상품 상세 페이지`;
  const imageUrl = toAbsoluteUrl(product.image_url || "/images/home.png");

  return {
    title: product.name,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title: product.name,
      description,
      url: productUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [imageUrl],
    },
  };
}

// DB 쿼리 + 렌더링을 담당하는 독립 async 서버 컴포넌트
async function ProductContent({ id }: { id: string }) {
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductContent id={id} />
    </Suspense>
  );
}
