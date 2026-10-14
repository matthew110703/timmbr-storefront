import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollapsePanel } from "./CollapsePanel";

const panel = () => screen.getByTestId("content").closest("[data-open]")!;

describe("CollapsePanel", () => {
  it("shows its content when open", () => {
    render(
      <CollapsePanel open>
        <p data-testid="content">Hello</p>
      </CollapsePanel>,
    );

    expect(panel()).toHaveAttribute("data-open", "true");
    expect(panel().className).toContain("visible");
    expect(panel().className).toContain("grid-rows-[1fr]");
    expect(panel().className).not.toContain("invisible");
  });

  it("hides closed content from the keyboard and screen readers (invisible)", () => {
    render(
      <CollapsePanel open={false}>
        <p data-testid="content">Hello</p>
      </CollapsePanel>,
    );

    expect(panel()).toHaveAttribute("data-open", "false");
    expect(panel().className).toContain("invisible");
    expect(panel().className).toContain("grid-rows-[0fr]");
  });

  it("can stay open on desktop whatever its state", () => {
    render(
      <CollapsePanel open={false} openOnDesktop>
        <p data-testid="content">Hello</p>
      </CollapsePanel>,
    );

    expect(panel().className).toContain("lg:visible");
    expect(panel().className).toContain("lg:grid-rows-[1fr]");
  });

  it("only animates when motion is allowed", () => {
    render(
      <CollapsePanel open>
        <p data-testid="content">Hello</p>
      </CollapsePanel>,
    );

    expect(panel().className).toContain("transition-[grid-template-rows");
    expect(panel().className).toContain("motion-reduce:transition-none");
  });
});
