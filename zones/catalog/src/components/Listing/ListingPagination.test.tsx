import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingPagination, pageWindow } from "./ListingPagination";

describe("pageWindow", () => {
  it("shows the first, last and neighbouring pages with gaps", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(1, 5)).toEqual([1, 2, null, 5]);
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    // A gap of one page shows the page instead of "…".
    expect(pageWindow(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("ListingPagination", () => {
  const props = {
    basePath: "/category/beds",
    total: 70,
    limit: 24,
    totalPages: 3,
  };

  it("links pages while keeping the filters and sort", () => {
    render(
      <ListingPagination
        {...props}
        page={2}
        state={{
          filters: { material: ["teak-wood"] },
          sort: "newest",
          page: 2,
        }}
      />,
    );
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/category/beds?material=teak-wood&page=3&sort=newest",
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/category/beds?material=teak-wood&sort=newest",
    );
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("Showing 25–48 of 70")).toBeInTheDocument();
  });

  it("renders nothing for a single page", () => {
    const { container } = render(
      <ListingPagination
        {...props}
        totalPages={1}
        page={1}
        state={{ filters: {}, page: 1 }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
