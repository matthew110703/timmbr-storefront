import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountPage from "./page";
import { strings } from "./strings";

describe("AccountPage", () => {
  it("renders the account title heading correctly", () => {
    render(<AccountPage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: strings.appName,
    });
    expect(heading).toBeInTheDocument();
  });
});
