"use client";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { useTexts } from "@/context/locale-context";

// Props interface for the main pagination component
interface PaginationProps {
  pageCount: number; // Total number of pages
  pageParam?: string; // Customize the query param name
}

// Props interface for the arrow buttons
interface PaginationArrowProps {
  direction: "left" | "right"; // Direction of the arrow
  href: string; // URL to navigate to
  isDisabled: boolean; // Whether the arrow should be disabled
}

// Arrow button component for navigation
const PaginationArrow: FC<PaginationArrowProps> = ({ direction, href, isDisabled }) => {
  const router = useRouter();
  const isLeft = direction === "left";

  return (
    <CustomButton
      onClick={(e) => {
        e.preventDefault();
        // Use Next.js client-side navigation without scroll reset
        router.push(href, { scroll: false });
      }}
      variant="outlined"
      className={`pagination-arrow ${isDisabled ? "disabled" : ""}`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </CustomButton>
  );
};

export function PaginationComponent({ pageCount, pageParam = "page" }: Readonly<PaginationProps>) {
  const { PAGINATION_PAGE_LABEL, PAGINATION_NAV_ARIA } = useTexts();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Use the custom pageParam instead of hardcoded "page"
  const currentPage = Number(searchParams.get(pageParam)) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav role="navigation" aria-label={PAGINATION_NAV_ARIA} className="pagination-nav">
      <ul className="pagination-list no-list-style">
        {/* Left arrow - disabled if on first page */}
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        {/* Current page indicator */}
        <li>
          <span className="page-number">
            {PAGINATION_PAGE_LABEL} {currentPage}
          </span>
        </li>
        {/* Right arrow - disabled if on last page */}
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </li>
      </ul>
    </nav>
  );
}
