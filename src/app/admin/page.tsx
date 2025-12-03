"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { SquareCheck } from "lucide-react";

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
        {products?.map((product) => (
          <>
            <Table className="w-180">
              <TableHeader className="rounded-lg border-t border-r border-l">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ))}
      </div>
    </section>
  );
}
