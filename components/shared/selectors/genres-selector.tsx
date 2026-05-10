import { useState } from "react";
import { Check, ChevronsUpDown, Minus } from "lucide-react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils/utils";

import { useDebounce } from "@/hooks/use-debounce";
import { useGenres } from "@/hooks/use-genres";

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

interface GenreSelectorProps {
  form: any;
  label?: string;
  placeholder?: string;
  emptyOptionLabel?: string;
}

export function GenreSelector({
  form,
  label = "Thể loại",
  placeholder = "Chọn thể loại...",
  emptyOptionLabel = "-- Bỏ chọn --",
}: GenreSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: genresRes, isLoading } = useGenres({ q: debouncedSearch });
  const genres = genresRes?.data || [];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-muted-foreground uppercase">
        {label}
      </label>

      <Controller
        name="genreId"
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
                  ? genres.find((genre: any) => genre.id === field.value)
                      ?.name || "Đã chọn thể loại"
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Tìm kiếm thể loại..."
                  className="text-foreground h-11"
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  {isLoading && (
                    <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                      Đang tải...
                    </div>
                  )}
                  {!isLoading && genres.length === 0 && (
                    <CommandEmpty className="text-muted-foreground p-4 text-center text-sm">
                      Không tìm thấy thể loại nào.
                    </CommandEmpty>
                  )}

                  <CommandGroup>
                    <CommandItem
                      value={emptyOptionLabel}
                      onSelect={() => {
                        field.onChange("");
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground mb-1 italic text-muted-foreground"
                    >
                      <Minus className="mr-2 h-4 w-4 opacity-50" />
                      {emptyOptionLabel}
                    </CommandItem>

                    {genres.map((genre: any) => (
                      <CommandItem
                        key={genre.id}
                        value={genre.id}
                        onSelect={() => {
                          field.onChange(genre.id);
                          setOpen(false);
                        }}
                        className="cursor-pointer text-foreground hover:bg-accent aria-selected:bg-accent"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            genre.id === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {genre.name}
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
