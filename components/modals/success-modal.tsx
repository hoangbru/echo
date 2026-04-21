"use client";

import { ReactNode } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  description?: ReactNode;
  onConfirm?: () => void;
}

export function SuccessModal({
  isOpen,
  title = "Thành công!",
  description,
  onConfirm,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-card border-white/10 text-white sm:max-w-md flex flex-col items-center justify-center py-10">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <DialogHeader className="text-center w-full flex flex-col items-center">
          <DialogTitle className="text-2xl font-bold mb-2">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {onConfirm && (
          <DialogFooter className="mt-6 w-full">
            <Button
              onClick={onConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              Tiếp tục ngay <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
