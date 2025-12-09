import type { Product } from "./product.model";

export interface CartItem
  extends Pick<Product, "id" | "name" | "price" | "image_url"> {
  selectedSize: string;
  quantity: number;
}
