import Image from "next/image";
import { Button } from "@/components/ui";
import type { CartItem } from "@/types";

export const CartList = ({
  products,
  handleQuantityChange,
  handleRemoveItem,
}: {
  products: CartItem[];
  handleQuantityChange: (
    productId: number,
    selectedSize: string,
    quantity: number
  ) => void;
  handleRemoveItem: (productId: number, selectedSize: string) => void;
}) => {
  return (
    <section className="flex w-full">
      <div className="flex w-full flex-col gap-4">
        {products.map((product) => (
          <div
            key={`${product.id}-${product.selectedSize}`}
            className="flex gap-20"
          >
            <Image
              src={product.image_url}
              alt={product.name}
              width={100}
              height={100}
              className="object-contain"
            />
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">{product.name}</p>
              <p>사이즈: {product.selectedSize}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleQuantityChange(
                      product.id,
                      product.selectedSize,
                      product.quantity - 1
                    )
                  }
                >
                  –
                </Button>

                <span className="w-8 text-center">{product.quantity}</span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleQuantityChange(
                      product.id,
                      product.selectedSize,
                      product.quantity + 1
                    )
                  }
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveItem(product.id, product.selectedSize)}
              className="w-fit cursor-pointer bg-red-400 font-bold text-white hover:bg-red-500 hover:text-white"
            >
              삭제
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
