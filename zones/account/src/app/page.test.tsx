import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { strings } from "./strings";

const requireUser = vi.hoisted(() => vi.fn());
vi.mock("@/lib/session", () => ({ requireUser }));

import AccountPage from "./page";

describe("AccountPage", () => {
  it("renders the signed-in user verified by timmbr-core", async () => {
    requireUser.mockResolvedValue({
      id: "u1",
      name: "Daenerys Targaryen",
      email: "dany@example.com",
    });

    render(await AccountPage());

    expect(requireUser).toHaveBeenCalledWith("/account");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: strings.account.greeting("Daenerys Targaryen"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("dany@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: strings.account.logout }),
    ).toBeInTheDocument();
  });

  it("does not render without a session (requireUser redirects)", async () => {
    requireUser.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(AccountPage()).rejects.toThrow("NEXT_REDIRECT");
  });
});
