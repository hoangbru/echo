"use client";

import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Matcher } from "react-day-picker";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: Matcher | Matcher[];
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled,
}: DatePickerProps) {
  const parsedDate = value ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background border-border hover:bg-card hover:border-primary hover:text-foreground text-foreground transition-colors",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {parsedDate ? (
            format(parsedDate, "dd/MM/yyyy", { locale: vi })
          ) : (
            <span className="text-sm">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-card border-border"
        align="start"
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
