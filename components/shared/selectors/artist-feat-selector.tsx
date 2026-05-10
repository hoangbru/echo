"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, User, X } from "lucide-react";
import { Controller } from "react-hook-form";

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
import { Badge } from "@/components/ui/badge";

import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils/utils";
import { useArtists } from "@/hooks/use-artists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeatArtist } from "@/types";

interface ArtistFeatSelectorProps {
  form: any;
  featArtists: FeatArtist[];
}

export function ArtistFeatSelector({
  form,
  featArtists,
}: ArtistFeatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedArtistsData, setSelectedArtistsData] = useState<any[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: artistsRes, isLoading } = useArtists({
    q: debouncedSearch,
    limit: 10,
    isVerified: true,
  });

  const results = artistsRes?.data || [];

  useEffect(() => {
    if (featArtists.length > 0 && selectedArtistsData.length === 0) {
      setSelectedArtistsData(featArtists);
      const ids = featArtists.map((a) => a.id);
      form.setValue("featArtistIds", ids);
    }
  }, [featArtists, form]);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-muted-foreground uppercase">
        Nghệ sĩ hát chung (Feat)
      </label>

      <Controller
        name="featArtistIds"
        control={form.control}
        render={({ field }) => {
          const selectedValues = field.value || [];

          const toggleArtist = (artist: any) => {
            const isSelected = selectedValues.includes(artist.id);

            if (isSelected) {
              field.onChange(
                selectedValues.filter((id: string) => id !== artist.id),
              );
              setSelectedArtistsData((prev) =>
                prev.filter((a) => a.id !== artist.id),
              );
              setOpen(false);
            } else {
              field.onChange([...selectedValues, artist.id]);
              setSelectedArtistsData((prev) => [...prev, artist]);
              setOpen(false);
            }
          };

          return (
            <div className="space-y-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-12 rounded-xl bg-background border-input text-foreground font-normal hover:bg-accent focus:ring-2 focus:ring-ring"
                  >
                    <span className="truncate">
                      {selectedValues.length > 0
                        ? `Đã chọn ${selectedValues.length} nghệ sĩ`
                        : "Tìm kiếm theo tên hoặc email..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Nhập tên hoặc email..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      className="h-11"
                    />
                    <CommandList>
                      {isLoading && (
                        <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                          Đang tìm...
                        </div>
                      )}
                      {!isLoading && results.length === 0 && (
                        <CommandEmpty>Không tìm thấy nghệ sĩ nào.</CommandEmpty>
                      )}

                      <CommandGroup>
                        {results.map((artist: any) => {
                          const isSelected = selectedValues.includes(artist.id);
                          return (
                            <CommandItem
                              key={artist.id}
                              value={artist.id}
                              onSelect={() => toggleArtist(artist)}
                              className="cursor-pointer hover:bg-accent py-2"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8 border border-border">
                                    <AvatarImage
                                      src={artist.profileImage}
                                      alt={artist.stageName}
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-background">
                                      <User className="w-4 h-4 text-muted-foreground" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {artist.stageName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {artist.contactEmail}
                                    </span>
                                  </div>
                                </div>
                                <Check
                                  className={cn(
                                    "h-4 w-4 text-primary",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedArtistsData.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-background/50 border border-dashed border-border rounded-xl">
                  {selectedArtistsData.map((artist) => (
                    <Badge
                      key={artist.id}
                      variant="secondary"
                      className="pl-1 pr-1 py-1 gap-1.5 border-primary/20 bg-primary/5 text-foreground hover:bg-primary/10"
                    >
                      <Avatar className="w-5 h-5 border border-border/50">
                        <AvatarImage
                          src={artist.profileImage}
                          alt={artist.stageName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-background text-[8px]">
                          {artist.stageName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="pb-0.5">{artist.stageName}</span>
                      <button
                        type="button"
                        onClick={() => toggleArtist(artist)}
                        className="hover:bg-destructive/20 hover:text-destructive rounded-full p-0.5 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
