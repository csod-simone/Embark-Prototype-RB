import type { ReactNode } from "react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";

type CsrQuestion = {
  sectionLabel: string;
  scenario?: string;
  prompt: string;
  image?: { src: string; alt: string; textBefore?: string; textAfter?: string };
};

/**
 * Renders light formatting used by assessment authors:
 *   **bold**, _italic_, and lines starting with "- " as a bulleted list.
 * Blank lines separate paragraphs.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/);
  const indentClass = (spaces: number) => {
    if (spaces >= 8) return "ml-16";
    if (spaces >= 6) return "ml-12";
    if (spaces >= 4) return "ml-8";
    if (spaces >= 2) return "ml-4";
    return undefined;
  };
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isBulletList = lines.every((line) => /^\s*-\s+/.test(line));
        const isNumberedList = lines.every((line) => /^\s*\d+\.\s+/.test(line));
        if (isBulletList || isNumberedList) {
          const List = isNumberedList ? "ol" : "ul";
          return (
            <List
              key={bi}
              className={`${isNumberedList ? "list-decimal" : "list-disc"} pl-5 space-y-1`}
            >
              {lines.map((line, li) => {
                const leadingSpaces = line.match(/^\s*/)?.[0].length ?? 0;
                const content = line.trim().replace(isNumberedList ? /^\d+\.\s+/ : /^-\s+/, "");
                return (
                  <li key={li} className={indentClass(leadingSpaces)}>
                    {inline(content)}
                  </li>
                );
              })}
            </List>
          );
        }
        return (
          <p key={bi} className={bi > 0 ? "mt-2" : undefined}>
            {lines.map((line, li) => {
              const leadingSpaces = line.match(/^\s*/)?.[0].length ?? 0;
              return (
              <span
                key={li}
                className={leadingSpaces > 0 ? `inline-block ${indentClass(leadingSpaces)}` : undefined}
              >
                {li > 0 && <br />}
                {inline(line.trimStart())}
              </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Scenario, prompt and optional image block for a question — shared by the player and review. */
export function QuestionContent({ question }: { question: CsrQuestion }) {
  return (
    <>
      {question.scenario ? (
        <LeftBorderCard borderVariant="brand">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1">
            {question.sectionLabel}
          </div>
          <RichText text={question.scenario} className="text-sm text-foreground" />
        </LeftBorderCard>
      ) : (
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1">
          {question.sectionLabel}
        </div>
      )}

      <RichText text={question.prompt} className="text-base font-semibold text-foreground" />

      {question.image && (
        <figure className="space-y-2">
          {question.image.textBefore && (
            <RichText text={question.image.textBefore} className="text-sm text-foreground" />
          )}
          <img
            src={question.image.src}
            alt={question.image.alt}
            loading="lazy"
            className="max-h-72 w-auto rounded-md border border-border"
          />
          {question.image.textAfter && (
            <figcaption>
              <RichText text={question.image.textAfter} className="text-sm text-foreground" />
            </figcaption>
          )}
        </figure>
      )}
    </>
  );
}
