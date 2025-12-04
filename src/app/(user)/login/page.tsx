"use client";

import { createClient } from "@/lib/supabase/client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("올바른 형식의 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

export default function LoginPage() {
  const supabase = createClient(); // 브라우저에서 실행
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error(error);
        toast.error(error.message || "로그인에 실패했습니다.");
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
        toast.success("로그인을 완료하였습니다.");

        // 쿼리 파라미터에서 redirect 경로 가져오기
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get("redirect") || "/";

        router.replace(redirectPath);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <main className="flex h-full min-h-[720px] w-full items-center justify-center gap-6 p-6">
      <div className="flex w-100 max-w-100 flex-col gap-6 px-6">
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            로그인
          </h4>
          <p className="text-muted-foreground">
            로그인을 위한 정보를 입력해 주세요.
          </p>
        </div>
        <div className="grid gap-3">
          {/* 회원가입 폼 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력하세요." {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 (8자 이상)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center">
                  <Button
                    type="submit"
                    variant={"outline"}
                    className="flex-1 cursor-pointer !bg-black !text-white"
                  >
                    로그인
                  </Button>
                </div>
                <div className="text-center">
                  계정이 없으신가요?
                  <Link href={"/signup"} className="ml-1 underline">
                    회원가입
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
