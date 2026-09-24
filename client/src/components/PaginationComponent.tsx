"use client";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
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
}

// Arrow button component for navigation
const PaginationArrow: FC<PaginationArrowProps> = ({ direction, href }) => {
  const router = useRouter();
  const isLeft = direction === "left";

  return (
    <CustomButton
      onClick={(e) => {
        e.preventDefault();
        // Use Next.js client-side navigation without scroll reset
        router.push(href, { scroll: false });
      }}
      variant="contained"
      color="primary"
      size="large"
      disableElevation
      className="pagination-arrow"
    >
      <CustomIcon name={isLeft ? "chevronLeft" : "chevronRight"} fontSize="inherit" />
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

  // A single page needs no pager
  if (pageCount <= 1) return null;

  return (
    <nav role="navigation" aria-label={PAGINATION_NAV_ARIA} className="pagination-nav">
      <ul className="pagination-list no-list-style">
        {/* Left arrow */}
        <li>
          <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} />
        </li>
        {/* Current page indicator */}
        <li>
          <span className="page-number">
            {PAGINATION_PAGE_LABEL} {currentPage} / {pageCount}
          </span>
        </li>
        {/* Right arrow */}
        <li>
          <PaginationArrow direction="right" href={createPageURL(currentPage + 1)} />
        </li>
      </ul>
    </nav>
  );
}
