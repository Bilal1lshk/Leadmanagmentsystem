"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-brand-line bg-white px-4 py-2 text-sm font-medium text-brand-gray hover:bg-brand-cream/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 rounded-lg text-sm font-medium ${
              page === currentPage
                ? "bg-brand-teal text-white"
                : "text-brand-gray hover:bg-brand-cream/60"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-brand-line bg-white px-4 py-2 text-sm font-medium text-brand-gray hover:bg-brand-cream/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}