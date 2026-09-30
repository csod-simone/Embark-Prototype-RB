import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button, buttonVariants } from "./button";

const variants = ["default", "destructive", "outline", "secondary", "tertiary", "grey", "ghost", "link"] as const;
const sizes = ["default", "sm", "lg", "icon"] as const;

// Forbid Tailwind fixed-height utilities like h-8, h-10, min-h-[40px], etc.
const FIXED_HEIGHT_RE = /(^|\s)(h-(?:\d+|\[[^\]]+\])|min-h-(?:\d+|\[[^\]]+\]))(\s|$)/;

describe("Button padding-driven sizing", () => {
  it("variant class strings include px-3 py-2 and no fixed height", () => {
    for (const size of sizes) {
      for (const variant of variants) {
        const classes = buttonVariants({ variant, size });
        expect(classes, `${variant}/${size} missing px-3`).toMatch(/(^|\s)px-3(\s|$)/);
        expect(classes, `${variant}/${size} missing py-2`).toMatch(/(^|\s)py-2(\s|$)/);
        expect(classes, `${variant}/${size} has fixed height: ${classes}`).not.toMatch(FIXED_HEIGHT_RE);
      }
    }
  });

  it("rendered buttons have no inline fixed height/min-height", () => {
    for (const size of sizes) {
      for (const variant of variants) {
        const { container, unmount } = render(
          <Button variant={variant} size={size}>Hi</Button>
        );
        const btn = container.querySelector("button")!;
        const cls = btn.className;
        expect(cls, `rendered ${variant}/${size}: ${cls}`).not.toMatch(FIXED_HEIGHT_RE);
        expect(btn.style.height, `inline height on ${variant}/${size}`).toBe("");
        expect(btn.style.minHeight, `inline min-height on ${variant}/${size}`).toBe("");
        unmount();
      }
    }
  });
});
