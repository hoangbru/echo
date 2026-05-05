"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {};

export const PrevButton = (props: Props) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="text-gray-400 hover:text-white"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
    </Button>
  );
};
