import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cartItem.model";
/**
 * 장바구니 수량 업데이트 Mutation
 */
export const useUpdateCartItemQuantity = (userId?: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      productId,
      selectedSize,
      quantity,
    }: {
      productId: number;
      selectedSize: string;
      quantity: number;
    }) => {
      if (!userId) throw new Error("User not logged in");

      const { error } = await supabase.from("cart").upsert(
        {
          user_id: userId,
          product_id: productId,
          size: selectedSize,
          quantity,
        },
        {
          onConflict: "user_id,product_id,size",
        }
      );

      if (error) throw error;
    },
    onMutate: async ({ productId, selectedSize, quantity }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["cart", userId] });

      // 이전 데이터 백업
      const previousCart = queryClient.getQueryData<CartItem[]>([
        "cart",
        userId,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<CartItem[]>(["cart", userId], (old) => {
        if (!old) return old;
        return old.map((item) =>
          item.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item
        );
      });

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", userId], context.previousCart);
      }
    },
    onSettled: () => {
      // 완료 후 쿼리 무효화 (재조회)
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

/**
 * 장바구니 아이템 삭제 Mutation
 */
export const useRemoveCartItem = (userId?: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      productId,
      selectedSize,
    }: {
      productId: number;
      selectedSize: string;
    }) => {
      if (!userId) throw new Error("User not logged in");

      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)
        .eq("size", selectedSize);

      if (error) throw error;
    },
    onMutate: async ({ productId, selectedSize }) => {
      await queryClient.cancelQueries({ queryKey: ["cart", userId] });

      const previousCart = queryClient.getQueryData<CartItem[]>([
        "cart",
        userId,
      ]);

      // 낙관적 삭제
      queryClient.setQueryData<CartItem[]>(["cart", userId], (old) => {
        if (!old) return old;
        return old.filter(
          (item) =>
            !(item.id === productId && item.selectedSize === selectedSize)
        );
      });

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", userId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

/**
 * 장바구니 아이템 추가 Mutation
 */
export const useAddCartItem = (userId?: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      productId,
      selectedSize,
    }: {
      productId: number;
      selectedSize: string;
    }) => {
      if (!userId) throw new Error("User not logged in");

      // 기존 아이템 확인
      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .eq("size", selectedSize)
        .maybeSingle();

      if (existing) {
        // 수량 증가
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // 새로 추가
        const { error } = await supabase.from("cart").insert({
          user_id: userId,
          product_id: productId,
          size: selectedSize,
          quantity: 1,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      // 캐시 무효화 → 헤더 장바구니 개수 자동 업데이트
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

/**
 * 장바구니 전체 비우기 Mutation (주문 완료 시 사용)
 */
export const useClearCart = (userId?: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not logged in");

      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart", userId] });

      const previousCart = queryClient.getQueryData<CartItem[]>([
        "cart",
        userId,
      ]);

      queryClient.setQueryData<CartItem[]>(["cart", userId], []);

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", userId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};
