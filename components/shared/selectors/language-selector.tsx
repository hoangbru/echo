import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { allLanguages } from "@/constants/languages";

interface LanguageSelectorProps {
  form: UseFormReturn<any>;
}

export function LanguageSelector({ form }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
        Ngôn ngữ
      </label>
      <Controller
        name="language"
        control={form.control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "flex h-12 w-full justify-between items-center rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground font-normal ring-offset-background hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
                  !field.value && "text-muted-foreground",
                )}
              >
                {field.value
                  ? allLanguages.find((lang) => lang.code === field.value)?.name
                  : "Chọn ngôn ngữ..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border">
              <Command>
                <CommandInput
                  placeholder="Tìm kiếm ngôn ngữ..."
                  className="text-foreground"
                />
                <CommandList>
                  <CommandEmpty className="text-muted-foreground p-4 text-center text-sm">
                    Không tìm thấy ngôn ngữ nào.
                  </CommandEmpty>
                  <CommandGroup>
                    {allLanguages.map((lang) => (
                      <CommandItem
                        value={lang.name}
                        key={lang.code}
                        onSelect={() => {
                          field.onChange(lang.code);
                          setOpen(false);
                        }}
                        className="cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            lang.code === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {lang.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
