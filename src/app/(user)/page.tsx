import { PAGE_SIZE, type ProductListItem } from "@/hooks/useProducts";
import { createClient } from "@/lib/supabase/server";
import HomeClient from "./HomeClient";

// SSR: 매 요청마다 서버에서 렌더링
// 첫 상품 목록을 서버에서 미리 가져와 FCP 개선 및 SEO 확보
const getInitialProducts = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    return [] as ProductListItem[];
  }

  return (data ?? []) as ProductListItem[];
};

export default async function HomePage() {
  const initialProducts = await getInitialProducts();

  return <HomeClient initialProducts={initialProducts} />;
}
