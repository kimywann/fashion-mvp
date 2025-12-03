export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  size: string[];
  description: string;
}

export interface CartItem
  extends Pick<Product, "id" | "name" | "price" | "image_url" | "size"> {
  quantity: number;
}

// export interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   selectedColor?: string;
//   selectedSize?: string;
// }

// export interface Order {
//   id: string;
//   user_id: string;
//   items: OrderItem[];
//   total: number;
//   status: "pending" | "paid" | "shipped";
//   created_at: string;
// }

// export interface User {
//   id: string;
//   email: string;
//   nickname: string;
// }
