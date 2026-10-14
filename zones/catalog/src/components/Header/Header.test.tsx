import React from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AUTH_MODAL_OPEN_EVENT } from "@timmbr/hooks";
import {
  AuthModalHost,
  clearSession,
  DEFAULT_AUTH_MESSAGES,
  loadSession,
} from "@timmbr/auth";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
import { strings } from "@/app/strings";

const USER = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
};
const copy = DEFAULT_AUTH_MESSAGES.profile;

/** The shell's real response shape: `{ success, data }` (not a bare `{ user }`). */
function mockShellSession(user: typeof USER | null) {
  // A fresh body per call: the header also loads the cart count.
  const fetchMock = vi.fn(async (input: RequestInfo | URL) =>
    String(input).includes("/cart/count")
      ? new Response(JSON.stringify({ success: true, data: { count: 2 } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      : new Response(JSON.stringify({ success: true, data: { user } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const CATEGORIES = [
  { id: "1", name: "Bedroom", slug: "bedroom", children: [] },
  {
    id: "2",
    name: "Living Room",
    slug: "living-room",
    children: [{ id: "3", name: "Sofas", slug: "sofas", children: [] }],
  },
];

function renderZone() {
  return render(
    <>
      <Header categories={CATEGORIES} />
      <AuthModalHost />
    </>,
  );
}

afterEach(() => {
  act(() => clearSession());
  vi.unstubAllGlobals();
});

describe("Header", () => {
  it("renders branding and navigation", () => {
    mockShellSession(null);
    renderZone();
    expect(
      screen.getAllByAltText(strings.branding.logoAlt).length,
    ).toBeGreaterThan(0);
    // Every root opens a menu (labels are never links)
    expect(
      screen.queryByRole("link", { name: "Bedroom" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Bedroom" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Living Room" }).length,
    ).toBeGreaterThan(0);
  });

  it("shows the signed-in user's first name from the shell's session", async () => {
    mockShellSession(USER);
    renderZone();

    const accountLinks = await screen.findAllByRole("link", {
      name: copy.accountAriaLabel("Daenerys Targaryen"),
    });
    expect(accountLinks[0]).toHaveAttribute("href", "/account");
    expect(screen.getAllByText("Daenerys").length).toBeGreaterThan(0);
  });

  it("shows LOGIN when signed out and opens the modal on this page", async () => {
    mockShellSession(null);
    renderZone();
    await act(() => loadSession());

    const opened = vi.fn();
    window.addEventListener(AUTH_MODAL_OPEN_EVENT, opened);
    const urlBefore = window.location.href;

    const [login] = screen.getAllByRole("button", {
      name: copy.loginAriaLabel,
    });
    expect(screen.getAllByText("LOGIN").length).toBeGreaterThan(0);
    fireEvent.click(login!);

    await waitFor(() => expect(opened).toHaveBeenCalled());
    // No redirect to the shell: the modal opens over the current page.
    expect(window.location.href).toBe(urlBefore);
    window.removeEventListener(AUTH_MODAL_OPEN_EVENT, opened);
  });
});
