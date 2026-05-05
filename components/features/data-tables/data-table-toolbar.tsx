"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { startOfDay, parseISO } from "date-fns";

import { DatePicker } from "@/components/shared";

import { useQueryString } from "@/hooks/use-query-string";

export interface ToolbarDropdownConfig {
  key: string;
  value: string;
  icon?: ReactNode;
  options: { label: string; value: string }[];
}

interface DataTableToolbarProps {
  searchKey?: string;
  searchValue?: string;
  searchPlaceholder?: string;

  dropdowns?: ToolbarDropdownConfig[];

  showDateRange?: boolean;
  fromDateValue?: string;
  toDateValue?: string;
}

export function DataTableToolbar({
  searchKey = "search",
  searchValue = "",
  searchPlaceholder = "Tìm kiếm...",
  dropdowns = [],
  showDateRange = false,
  fromDateValue,
  toDateValue,
}: DataTableToolbarProps) {
  const { updateURL } = useQueryString();

  const handleDateChange = (key: string, date: Date | undefined) => {
    const dateString = date ? date.toISOString().split("T")[0] : "";
    updateURL(key, dateString);
  };

  const today = startOfDay(new Date());

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-card p-4 rounded-xl border border-border mb-6">
      <div className="flex items-center gap-2 w-full lg:flex-1 bg-background border border-border rounded-lg px-3 py-2 focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          defaultValue={searchValue}
          onChange={(e) => updateURL(searchKey, e.target.value)}
          className="w-full bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {dropdowns.map((dropdown) => (
          <div
            key={dropdown.key}
            className="flex items-center gap-2 flex-1 md:flex-none"
          >
            {dropdown.icon && (
              <span className="text-muted-foreground hidden xl:block">
                {dropdown.icon}
              </span>
            )}
            <select
              value={dropdown.value}
              onChange={(e) => updateURL(dropdown.key, e.target.value)}
              className="w-full min-w-[140px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none cursor-pointer transition-colors"
            >
              {dropdown.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {showDateRange && (
          <>
            <div className="flex items-center gap-2 flex-1 md:flex-none md:w-[150px]">
              <DatePicker
                placeholder="Từ ngày"
                value={fromDateValue}
                onChange={(date) => handleDateChange("fromDate", date)}
                disabled={(date) => startOfDay(date) > today}
              />
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-none md:w-[150px]">
              <span className="text-sm text-muted-foreground hidden xl:block px-1">
                -
              </span>
              <DatePicker
                placeholder="Đến ngày"
                value={toDateValue}
                onChange={(date) => handleDateChange("toDate", date)}
                disabled={(date) => {
                  const dateToCompare = startOfDay(date);
                  if (dateToCompare > today) return true;
                  if (fromDateValue) {
                    const fromDate = startOfDay(parseISO(fromDateValue));
                    if (dateToCompare < fromDate) return true;
                  }
                  return false;
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
