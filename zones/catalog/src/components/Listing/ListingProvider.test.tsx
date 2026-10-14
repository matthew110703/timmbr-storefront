import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ListingState } from "@timmbr/utils";
import { listingFixture } from "@/test/listing-fixtures";
import { ListingProvider, ListingResults, useListing } from "./ListingProvider";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function Controls() {
  const { state, dispatch, pending } = useListing();
  return (
    <div>
      <output data-testid="material">
        {(state.filters.material ?? []).join(",")}
      </output>
      <output data-testid="pending">{String(pending)}</output>
      {["oak-wood", "ash-wood", "pine"].map((value) => (
        <button
          key={value}
          onClick={() =>
            dispatch(
              { type: "toggle", key: "material", value },
              { debounce: true },
            )
          }
        >
          {value}
        </button>
      ))}
      <button onClick={() => dispatch({ type: "setSort", sort: "newest" })}>
        sort
      </button>
    </div>
  );
}

const applied: ListingState = { filters: { material: ["teak-wood"] }, page: 1 };

const renderProvider = (state = applied) =>
  render(
    <ListingProvider
      listing={listingFixture()}
      applied={state}
      basePath="/category/living-room"
    >
      <Controls />
      <ListingResults>
        <p>results</p>
      </ListingResults>
    </ListingProvider>,
  );

describe("ListingProvider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    push.mockReset();
  });

  it("shows ticks at once and batches quick ticks into one navigation", () => {
    renderProvider();
    fireEvent.click(screen.getByText("oak-wood"));
    fireEvent.click(screen.getByText("ash-wood"));
    fireEvent.click(screen.getByText("pine"));

    expect(screen.getByTestId("material").textContent).toBe(
      "ash-wood,oak-wood,pine,teak-wood",
    );
    expect(screen.getByTestId("pending").textContent).toBe("true");
    expect(screen.getByText("results").parentElement).toHaveAttribute(
      "data-pending",
    );
    expect(push).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(260));
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      "/category/living-room?material=ash-wood,oak-wood,pine,teak-wood",
      { scroll: false },
    );
  });

  it("navigates at once for non-debounced changes, cancelling a pending batch", () => {
    renderProvider();
    fireEvent.click(screen.getByText("oak-wood"));
    fireEvent.click(screen.getByText("sort"));
    act(() => vi.advanceTimersByTime(500));
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      "/category/living-room?material=oak-wood,teak-wood&sort=newest",
      { scroll: false },
    );
  });

  it("follows a new page (back/forward), even when it returns to an earlier URL", () => {
    const { rerender } = renderProvider();
    fireEvent.click(screen.getByText("oak-wood"));
    act(() => vi.advanceTimersByTime(260));

    const next: ListingState = {
      filters: { material: ["oak-wood", "teak-wood"] },
      page: 1,
    };
    const view = (state: ListingState) => (
      <ListingProvider
        listing={listingFixture()}
        applied={state}
        basePath="/category/living-room"
      >
        <Controls />
      </ListingProvider>
    );
    rerender(view(next));
    expect(screen.getByTestId("material").textContent).toBe(
      "oak-wood,teak-wood",
    );
    rerender(view(applied)); // back
    expect(screen.getByTestId("material").textContent).toBe("teak-wood");
  });

  it("doesn't navigate to the page it is already on", () => {
    renderProvider();
    fireEvent.click(screen.getByText("oak-wood"));
    fireEvent.click(screen.getByText("oak-wood"));
    act(() => vi.advanceTimersByTime(260));
    expect(push).not.toHaveBeenCalled();
  });
});
