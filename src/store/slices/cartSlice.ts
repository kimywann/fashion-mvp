import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id && item.selectedSize === newItem.selectedSize
      );

      if (existingItem) {
        // 같은 상품과 사이즈가 이미 있으면 수량만 증가
        existingItem.quantity += newItem.quantity;
      } else {
        // 없으면 새로 추가
        state.items.push(newItem);
      }
    },
    removeItem: (state, action) => {
      const { productId, selectedSize } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      );
    },
    updateItemQuantity: (state, action) => {
      const { productId, selectedSize, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === productId && item.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    setCartItems: (state, action) => {
      // DB에서 가져온 장바구니로 전체 교체
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
