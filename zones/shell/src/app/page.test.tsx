import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ShellPage from "./page";
import { strings } from "./strings";

vi.mock("./page.helper", () => ({
  resolveLandingSections: vi
    .fn()
    .mockResolvedValue([<h1 key="title">timmbr</h1>]),
}));

describe("Shell Root Page", () => {
  it("renders the landing sections", async () => {
    const Component = await ShellPage();
    render(Component);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
