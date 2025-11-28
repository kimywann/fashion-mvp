import { ProductCard } from "@/components/ProductCard";

const products = [
  {
    id: "1",
    name: "Product 1",
    price: 10000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "2",
    name: "Product 2",
    price: 20000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "3",
    name: "Product 3",
    price: 30000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "4",
    name: "Product 4",
    price: 40000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "5",
    name: "Product 5",
    price: 50000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "6",
    name: "Product 6",
    price: 60000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "7",
    name: "Product 7",
    price: 70000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "8",
    name: "Product 8",
    price: 80000,
    imageUrl: "/images/sample.jpg",
  },
  {
    id: "9",
    name: "Product 9",
    price: 90000,
    imageUrl: "/images/sample.jpg",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Home</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
