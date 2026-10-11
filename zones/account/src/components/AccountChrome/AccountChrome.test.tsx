import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { AccountChrome } from "./AccountChrome";
import { strings } from "@/app/strings";

const renderChrome = () =>
  render(
    <AccountChrome
      header={<h1>Your account</h1>}
      nav={<nav aria-label="Account">side nav</nav>}
    >
      <p>page</p>
    </AccountChrome>,
  );

describe("AccountChrome", () => {
  it("hub (/): header shown on every screen, no back link", () => {
    nav.pathname = "/";
    renderChrome();
    expect(screen.getByTestId("account-header").className).not.toContain(
      "hidden",
    );
    expect(
      screen.queryByRole("link", { name: strings.account.backLabel }),
    ).toBeNull();
  });

  it("section page: phones get only a back link to the hub", () => {
    nav.pathname = "/addresses";
    renderChrome();
    expect(screen.getByTestId("account-header").className).toContain(
      "hidden lg:block",
    );
    const back = screen.getByRole("link", { name: strings.account.backLabel });
    expect(back).toHaveAttribute("href", "/");
    expect(back.className).toContain("lg:hidden");
  });

  it("keeps the side nav for desktop only", () => {
    renderChrome();
    expect(screen.getByTestId("account-nav").className).toContain("hidden");
    expect(screen.getByTestId("account-nav").className).toContain("lg:block");
  });
});
