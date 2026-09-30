import type { ReactNode } from "react";
import { AIThinking } from "@/components/ui/ai-thinking";

function DemoPanel({
  title,
  dark = false,
  children,
}: {
  title: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={
        dark
          ? "dark rounded-card border border-border bg-background p-8 text-foreground"
          : "rounded-card border border-border bg-background p-8 text-foreground"
      }
    >
      <h2 className="mb-6 font-sans text-base font-medium leading-5">{title}</h2>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

function DemoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-sm font-medium leading-5 text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}

export default function AIThinkingDemo() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <header className="mb-10">
        <h1 className="text-sm font-medium leading-5">AI thinking animation</h1>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          Workforce AI design system — light and dark mode, all required usage patterns.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoPanel title="Light mode">
          <DemoRow label="Default (static)">
            <AIThinking label="Thinking…" />
          </DemoRow>
          <DemoRow label="Rotating messages">
            <AIThinking messages={["Thinking…", "Rendering…", "Gathering response…"]} />
          </DemoRow>
          <DemoRow label="Pill variant">
            <AIThinking variant="pill" label="Gathering response…" />
          </DemoRow>
          <DemoRow label="Custom interval">
            <AIThinking interval={1800} messages={["Thinking…", "Almost there…"]} />
          </DemoRow>
        </DemoPanel>

        <DemoPanel title="Dark mode" dark>
          <DemoRow label="Default (static)">
            <AIThinking label="Thinking…" />
          </DemoRow>
          <DemoRow label="Rotating messages">
            <AIThinking messages={["Thinking…", "Rendering…", "Gathering response…"]} />
          </DemoRow>
          <DemoRow label="Pill variant">
            <AIThinking variant="pill" label="Gathering response…" />
          </DemoRow>
          <DemoRow label="Custom interval">
            <AIThinking interval={1800} messages={["Thinking…", "Almost there…"]} />
          </DemoRow>
        </DemoPanel>
      </div>

      <p className="mt-8 text-sm leading-5 text-muted-foreground">
        Reduced motion: animations are disabled automatically when the user prefers reduced motion.
      </p>
    </div>
  );
}
