"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { toast } from "sonner";

const supabase = createClient();

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("*");
      if (error) {
        toast.error(error.message);
        return;
      }
      setProducts(products);
    };
    fetchProducts();
  }, []);

  return (
    <section className="h-full w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">관리자 페이지</h1>
      </div>
      <div className="mt-8">
        <Table className="w-180">
          <TableHeader className="rounded-lg border-t border-r border-l">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {new Date(product.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
