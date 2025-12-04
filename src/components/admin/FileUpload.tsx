"use client";

import { useRef } from "react";
import { Button, Input } from "@/components/ui";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface Props {
  value: File | string | null;
  onChange: (file: File | string | null) => void;
}

export const FileUpload = ({ value, onChange }: Props) => {
  const FileinputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] as File);

    // 동일 파일 선택이 불가능할 수 있으므로 event.target.value를 초기화
    event.target.value = "";
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-96 w-96 cursor-pointer">
        {value ? (
          <>
            <Image
              src={
                typeof value === "string" ? value : URL.createObjectURL(value)
              }
              alt="미리보기"
              fill
              className="rounded-lg object-contain"
            />
            <Button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-8 w-8 cursor-pointer bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
            >
              <X className="size-4" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => FileinputRef.current?.click()}
            className="h-full w-full cursor-pointer flex-col gap-2 border-2 border-dashed"
          >
            <Upload className="text-muted-foreground h-8 w-8" />
            <span className="text-muted-foreground text-sm">이미지 업로드</span>
          </Button>
        )}
      </div>

      <Input
        ref={FileinputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
