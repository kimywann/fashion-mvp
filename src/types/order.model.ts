export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  delivery_info?: DeliveryInfo | null;
  total_price: number;
  created_at: string;
}

export interface DeliveryInfo {
  recipient_name: string;
  postal_code: string;
  address: string;
  detail_address: string;
  phone: string;
}
