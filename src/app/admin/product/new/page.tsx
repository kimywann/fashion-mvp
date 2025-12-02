"use client";

import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";

import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";
import SizeSelector from "@/components/SizeSelector";
import CategorySelector from "@/components/CategorySelector";
import { nanoid } from "nanoid";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요."),
  price: z.number({ message: "숫자를 입력해주세요." }),
  size: z.array(z.string()).min(1, "최소 1개 이상 사이즈를 선택해 주세요."),
  category: z.string().min(1, "카테고리를 입력해 주세요."),
  description: z.string().min(1, "설명을 입력해 주세요."),
  image: z.custom<File>((file) => file instanceof File, {
    message: "이미지를 업로드해 주세요.",
  }),
});

export default function ProductAddPage() {
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      size: [],
      category: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | null = null;

    if (values.image) {
      const fileExt = values.image.name.split(".").pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, values.image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (!data) throw new Error("상품 이미지 public URL 가져오기 실패");

      imageUrl = data.publicUrl;
    }

    try {
      const { error } = await supabase.from("products").insert({
        name: values.name,
        price: values.price,
        size: values.size,
        category: values.category,
        description: values.description,
        image_url: imageUrl,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("상품이 등록되었습니다.");
    } catch (error) {
      toast.error("상품 등록에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <>
      <section className="h-full w-full p-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">상품 등록</h1>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4">
          {/* 상품 등록 폼 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-8">
                <section className="flex flex-1 flex-col gap-4">
                  <h1 className="text-base font-bold">STEP 1</h1>

                  {/* 이름 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="상품 이름을 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* 가격 */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>가격</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="상품 가격을 입력해주세요."
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              field.onChange(
                                nextValue === "" ? undefined : Number(nextValue)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* 사이즈 */}
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>사이즈</FormLabel>
                        <FormControl>
                          <SizeSelector value={value} onChange={onChange} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* 카테고리 */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <FormControl>
                          <CategorySelector value={value} onChange={onChange} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* 설명 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>설명</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="상품 설명을 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </section>

                <section className="flex flex-1 flex-col gap-4">
                  <h1 className="text-base font-bold">STEP 2</h1>
                  <div className="flex flex-col gap-4">
                    {/* 이미지 */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormLabel>상품 이미지</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <FileUpload value={value} onChange={onChange} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="cursor-pointer">
                      등록하기
                    </Button>
                  </div>
                </section>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
