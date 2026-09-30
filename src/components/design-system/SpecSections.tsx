import { useState, type ReactNode } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";

/* ──────────────────────────────────────────────────────────
 * Reusable spec section components for /design-system pages.
 * Use the same layout & section order on every element page.
 * Skip sections that don't apply (e.g. Loading for Badge).
 * ────────────────────────────────────────────────────────── */

export function SpecSection({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        {kicker && <p className="text-[11px] tracking-wider font-semibold text-muted-foreground">{kicker}</p>}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

/* ── Spacing & Sizing ───────────────────────────────────── */
export type SizeRow = {
  size: string;            // e.g. "sm" | "md" | "lg"
  paddingX: string;        // "12px"
  paddingY: string;        // "8px"
  minHeight: string;       // "32px"
  minWidth: string;        // "64px"
  iconGap: string;         // "8px"
  iconSize: string;        // "16px"
  fontSize: string;        // "14px"
};

export function SpacingSpec({
  rows,
  borderWidth,
  borderRadius,
}: {
  rows: SizeRow[];
  borderWidth: string;
  borderRadius: string;
}) {
  return (
    <SpecSection title="Spacing & sizing" kicker="Layout">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              {["Size", "Padding (X)", "Padding (Y)", "Min height", "Min width", "Icon size", "Icon ↔ label gap", "Font size"].map((h) => (
                <th key={h} className="px-3 py-2 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{r.size}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.paddingX}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.paddingY}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.minHeight}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.minWidth}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.iconSize}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.iconGap}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.fontSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Border width: <span className="font-mono text-foreground">{borderWidth}</span> · Border radius:{" "}
        <span className="font-mono text-foreground">{borderRadius}</span>
      </p>
    </SpecSection>
  );
}

/* ── Typography ─────────────────────────────────────────── */
export type TypographySpecValues = {
  fontFamilyToken: string;     // "font-sans (Lato)"
  fontWeight: string;          // "500 (medium)"
  letterSpacing: string;       // "0"
  lineHeight: string;          // "20px (leading-5)"
  textTransform: string;       // "none"
  perSize: { size: string; fontSize: string }[];
};

export function TypographySpec({ values }: { values: TypographySpecValues }) {
  return (
    <SpecSection title="Typography tokens" kicker="Label text">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SpecKV label="Font family token" value={values.fontFamilyToken} />
        <SpecKV label="Font weight" value={values.fontWeight} />
        <SpecKV label="Letter spacing" value={values.letterSpacing} />
        <SpecKV label="Line height" value={values.lineHeight} />
        <SpecKV label="Text transform" value={values.textTransform} />
        <SpecKV label="Font sizes" value={values.perSize.map((p) => `${p.size}: ${p.fontSize}`).join(" · ")} />
      </div>
    </SpecSection>
  );
}

function SpecKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-2 rounded-md border border-border bg-card">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground text-right">{value}</span>
    </div>
  );
}

/* ── Icon support ───────────────────────────────────────── */
export function IconSupportSpec({
  iconLeft,
  iconRight,
  iconOnly,
  gap,
  iconSize,
}: {
  iconLeft: ReactNode;
  iconRight: ReactNode;
  iconOnly: ReactNode;
  gap: string;
  iconSize: string;
}) {
  return (
    <SpecSection title="Icon support" kicker="Layout variants">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <IconCard label="Icon left + label">{iconLeft}</IconCard>
        <IconCard label="Icon right + label">{iconRight}</IconCard>
        <IconCard label="Icon only (with tooltip)">{iconOnly}</IconCard>
      </div>
      <p className="text-xs text-muted-foreground">
        Icon ↔ text gap: <span className="font-mono text-foreground">{gap}</span> · Icon size:{" "}
        <span className="font-mono text-foreground">{iconSize}</span>
      </p>
    </SpecSection>
  );
}

function IconCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card flex flex-col items-start gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}

/* ── Loading state ──────────────────────────────────────── */
export function LoadingSpec({
  preview,
  spinnerToken,
  widthLocked,
  opacity,
  ariaLive,
}: {
  preview: ReactNode;
  spinnerToken: string;
  widthLocked: boolean;
  opacity: string;
  ariaLive: string;
}) {
  return (
    <SpecSection title="Loading state" kicker="Async feedback">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card flex items-center justify-center">{preview}</div>
        <div className="space-y-2">
          <SpecKV label="Spinner color" value={spinnerToken} />
          <SpecKV label="Width locked during load" value={widthLocked ? "Yes (prevents reflow)" : "No"} />
          <SpecKV label="Opacity while loading" value={opacity} />
          <SpecKV label="aria-live region" value={ariaLive} />
        </div>
      </div>
    </SpecSection>
  );
}

/* ── Motion ─────────────────────────────────────────────── */
export type MotionRow = { transition: string; properties: string; duration: string; easing: string };
export function MotionSpec({ rows }: { rows: MotionRow[] }) {
  return (
    <SpecSection title="Transition & animation" kicker="Motion">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              {["Transition", "Properties", "Duration", "Easing"].map((h) => (
                <th key={h} className="px-3 py-2 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.transition} className="border-t border-border">
                <td className="px-3 py-2">{r.transition}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.properties}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.duration}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.easing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SpecSection>
  );
}

/* ── Accessibility ──────────────────────────────────────── */
export type A11yValues = {
  role: string;
  ariaAttributes: string[];
  keyboard: { key: string; action: string }[];
  focusRing: string;
  contrast: string;
  loadingAnnouncement?: string;
};
export function A11ySpec({ values }: { values: A11yValues }) {
  return (
    <SpecSection title="Accessibility" kicker="A11y">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SpecKV label="ARIA role" value={values.role} />
        <SpecKV label="Focus ring" value={values.focusRing} />
        <SpecKV label="Min contrast ratio" value={values.contrast} />
        {values.loadingAnnouncement && <SpecKV label="Loading announcement" value={values.loadingAnnouncement} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Required ARIA attributes</p>
          <ul className="list-disc pl-5 space-y-1">
            {values.ariaAttributes.map((a) => (
              <li key={a} className="text-xs font-mono text-foreground">{a}</li>
            ))}
          </ul>
        </div>
        <div className="p-3 rounded-lg border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Keyboard interaction</p>
          <ul className="space-y-1">
            {values.keyboard.map((k) => (
              <li key={k.key} className="text-xs">
                <span className="font-mono text-foreground">{k.key}</span>
                <span className="text-muted-foreground"> — {k.action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SpecSection>
  );
}

/* ── Usage in context ───────────────────────────────────── */
export function UsageInContext({ examples }: { examples: { label: string; node: ReactNode }[] }) {
  return (
    <SpecSection title="Usage in context" kicker="Real layouts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examples.map((e) => (
          <div key={e.label} className="p-4 rounded-lg border border-border bg-card space-y-3">
            <p className="text-xs text-muted-foreground">{e.label}</p>
            <div>{e.node}</div>
          </div>
        ))}
      </div>
    </SpecSection>
  );
}

/* ── Code snippet ───────────────────────────────────────── */
export function CodeSnippetSection({ snippets }: { snippets: { label: string; code: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <SpecSection title="Code snippets" kicker="Usage">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-0" : "-rotate-90"}`} />
        {open ? "Hide code" : "Show code"}
      </button>
      {open && (
        <div className="space-y-3">
          {snippets.map((s) => (
            <CodeBlock key={s.label} label={s.label} code={s.code} />
          ))}
        </div>
      )}
    </SpecSection>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="rounded-lg border border-border bg-zinc-950 text-zinc-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-zinc-50"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 text-xs leading-5 overflow-x-auto"><code>{code}</code></pre>
    </div>
  );
}
