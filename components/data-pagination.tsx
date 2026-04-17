"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type DataPaginationProps = {
  currentPage: number;
  totalPages: number;
  currentCount: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  itemName?: string;
};

const DataPagination = ({
  currentPage,
  totalPages,
  currentCount,
  totalCount,
  onPageChange,
  itemName = "mục",
}: DataPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border mt-6">
      <p className="text-sm text-muted-foreground hidden md:block">
        Hiển thị{" "}
        <span className="text-foreground font-bold">{currentCount}</span> trên
        tổng số <span className="text-foreground font-bold">{totalCount}</span>{" "}
        {itemName}
      </p>

      <div className="flex gap-2 w-full md:w-auto justify-between md:justify-end">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="bg-input border-border text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>

        <div className="flex items-center px-4 text-sm font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`bg-input border-border text-foreground hover:bg-secondary ${currentPage >= totalPages ? "hover:cursor-not-allowed" : ""}`}
        >
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DataPagination;
