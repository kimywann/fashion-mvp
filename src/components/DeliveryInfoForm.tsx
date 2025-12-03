"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from "@/components/ui";

// 배송 정보 스키마
export const deliveryInfoSchema = z.object({
  recipientName: z.string().min(1, "수령인 이름을 입력해 주세요."),
  postalCode: z.string().min(5, "우편번호를 입력해 주세요."),
  address: z.string().min(1, "주소를 입력해 주세요."),
  detailAddress: z.string().min(1, "상세 주소를 입력해 주세요."),
  phone: z
    .string()
    .min(1, "연락처를 입력해 주세요.")
    .regex(/^[0-9-]+$/, "올바른 연락처 형식이 아닙니다."),
});

export type DeliveryInfoFormData = z.infer<typeof deliveryInfoSchema>;

interface DeliveryInfoFormProps {
  onSubmit: (data: DeliveryInfoFormData) => void;
  defaultValues?: Partial<DeliveryInfoFormData>;
}

export function DeliveryInfoForm({ onSubmit }: DeliveryInfoFormProps) {
  const form = useForm<DeliveryInfoFormData>({
    resolver: zodResolver(deliveryInfoSchema),
    defaultValues: {
      recipientName: "",
      postalCode: "",
      address: "",
      detailAddress: "",
      phone: "",
    },
  });

  // 다음 주소 API (Daum Postcode Service)
  const handleAddressSearch = () => {
    if (typeof window === "undefined") return;

    new window.daum.Postcode({
      oncomplete: (data: { zonecode: string; address: string }) => {
        form.setValue("postalCode", data.zonecode);
        form.setValue("address", data.address);
        form.setValue("detailAddress", "");
      },
    }).open();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 수령인 */}
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-24 shrink-0">수령인</FormLabel>
              <FormControl className="flex-1">
                <Input placeholder="수령인 이름을 입력해 주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 우편번호 및 주소 검색 */}
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="flex flex-1 items-center gap-4">
                <FormLabel className="w-24 shrink-0">우편번호</FormLabel>
                <FormControl className="flex-1">
                  <Input placeholder="우편번호" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddressSearch}
              className="h-10 cursor-pointer"
            >
              주소 검색
            </Button>
          </div>
        </div>

        {/* 주소 */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-24 shrink-0">주소</FormLabel>
              <FormControl className="flex-1">
                <Input placeholder="주소" readOnly {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 상세 주소 */}
        <FormField
          control={form.control}
          name="detailAddress"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-24 shrink-0">상세 주소</FormLabel>
              <FormControl className="flex-1">
                <Input placeholder="상세 주소를 입력해 주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 연락처 */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-24 shrink-0">연락처</FormLabel>
              <FormControl className="flex-1">
                <Input
                  placeholder="010-1234-5678"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9-]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
