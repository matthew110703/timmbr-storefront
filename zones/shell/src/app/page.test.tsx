import { describe, it, expect, vi } from "vitest";
import ShellPage from "./page";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Shell Root Page", () => {
  it("redirects to /home", () => {
    ShellPage();
    expect(redirect).toHaveBeenCalledWith("/home");
  });
});
