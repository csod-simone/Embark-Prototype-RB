import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Lightweight visual regression guard for the "Ask Cornerstone AI" CTA.
 *
 * We don't render the button in a real browser here — pseudo-elements and
 * :hover states aren't reliably testable in jsdom. Instead we statically
 * assert the contract that produces the premium shimmer/sparkle:
 *
 *   1. `src/index.css` defines the base, dark, hover, ::after (beam) and
 *      ::before (sparkle) rules along with both keyframe animations.
 *   2. `src/components/AppSidebar.tsx` renders the CTA without utility
 *      classes that previously muted the effect
 *      (`hover:opacity-*`, `bg-[hsl(var(--figma-c1))]`, `text-foreground`).
 *
 * If either contract breaks, the hover treatment regresses to the dull
 * state we kept fixing — this test fails fast in CI.
 */

const css = readFileSync(resolve(__dirname, "../index.css"), "utf8");
const sidebar = readFileSync(
  resolve(__dirname, "../components/AppSidebar.tsx"),
  "utf8",
);

describe("Ask Cornerstone AI CTA — shimmer regression", () => {
  describe("index.css contract", () => {
    it("defines the base .ask-ai-cta rule", () => {
      expect(css).toMatch(/\.ask-ai-cta\s*\{/);
    });

    it("defines a dark-theme override for .ask-ai-cta", () => {
      expect(css).toMatch(/\.dark\s+\.ask-ai-cta\s*\{/);
    });

    it("defines the tapered light beam (::after) and sparkle (::before)", () => {
      expect(css).toMatch(/\.ask-ai-cta::after/);
      expect(css).toMatch(/\.ask-ai-cta::before/);
    });

    it("animates the beam and sparkle on hover", () => {
      expect(css).toMatch(/\.ask-ai-cta:hover::after[\s\S]*?animation:\s*ask-ai-beam/);
      expect(css).toMatch(/\.ask-ai-cta:hover::before[\s\S]*?ask-ai-twinkle/);
    });

    it("declares both keyframes used by the hover state", () => {
      expect(css).toMatch(/@keyframes\s+ask-ai-beam\s*\{/);
      expect(css).toMatch(/@keyframes\s+ask-ai-twinkle\s*\{/);
    });

    it("respects prefers-reduced-motion", () => {
      expect(css).toMatch(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ask-ai-cta:hover/,
      );
    });
  });

  describe("AppSidebar markup contract", () => {
    // Pull out only lines that apply the ask-ai-cta class so we don't trip
    // on unrelated utilities elsewhere in the file.
    const ctaClassLines = sidebar
      .split("\n")
      .filter((line) => line.includes("ask-ai-cta"));

    it("renders the CTA in both collapsed and expanded sidebar states", () => {
      expect(ctaClassLines.length).toBeGreaterThanOrEqual(2);
    });

    for (const muting of [
      /hover:opacity-/,
      /bg-\[hsl\(var\(--figma-c1\)\)\]/,
      /\btext-foreground\b/,
    ]) {
      it(`does not re-introduce muting class ${muting}`, () => {
        for (const line of ctaClassLines) {
          expect(line).not.toMatch(muting);
        }
      });
    }
  });
});
