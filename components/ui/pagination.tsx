"use client";
import Button from "./button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className={`disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        Previous
      </Button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  );
}
