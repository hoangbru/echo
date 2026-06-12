"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  closeText?: string;
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  description,
  closeText = "Đóng",
}: InfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            {closeText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}