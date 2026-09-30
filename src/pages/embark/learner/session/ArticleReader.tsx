import { useState } from "react";
import { FileText, Play, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { BreadcrumbBar } from "@/components/embark/BreadcrumbBar";
import { ContentSections } from "@/components/embark/session/ContentSections";
import { getReviewContent, type ReviewContentEntry } from "@/data/reviewContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const READ_PROGRESS = 45;

const defaultTocItems = [
  { id: "part-a", label: "Part A Coverage" },
  { id: "part-b", label: "Part B Coverage", active: true },
  { id: "primary-secondary", label: "Primary vs Secondary Coverage" },
  { id: "deductibles", label: "Deductibles and Coinsurance" },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function KeyTerm({
  id,
  term,
  title,
  body,
  openId,
  setOpenId,
}: {
  id: string;
  term: string;
  title: string;
  body: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
}) {
  return (
    <Popover open={openId === id} onOpenChange={(o) => setOpenId(o ? id : null)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-secondary-foreground underline decoration-dotted decoration-secondary-foreground/60 underline-offset-4 cursor-pointer"
        >
          {term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px]" side="bottom" align="start">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-sm text-foreground">{body}</div>
          <a href="#" className="text-[11px] text-muted-foreground hover:text-primary hover:underline">
            From your curriculum ↗
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ArticleReader({
  onAskAboutSelection,
  entry,
}: {
  onAskAboutSelection: (quote: string) => void;
  /** Content shown by the reader. Defaults to the Coverage Determination article. */
  entry?: ReviewContentEntry;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const selectionQuote = "Medicare typically acts as the primary payer";
  const content = entry ?? getReviewContent(undefined, "coverage-determination");
  const isDefaultArticle = content.id === "coverage-determination";
  const tocItems = isDefaultArticle
    ? defaultTocItems
    : content.sections.map((s, i) => ({ id: slug(s.heading), label: s.heading, active: i === 0 }));

  return (
    <div className="flex flex-col h-full">
      {/* Header block */}
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-border bg-card">
        <BreadcrumbBar
          items={[
            { label: "Home", href: "/learner/home" },
            { label: "My Journey", href: "/learner/journey" },
            { label: content.moduleName },
            { label: content.title },
          ]}
        />

        {/* Modality selector */}
        <div className="mt-3 flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-primary border-b-2 border-primary -mb-px"
          >
            <FileText className="h-4 w-4" /> Read
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border-b-2 border-transparent -mb-px hover:bg-muted"
          >
            <Play className="h-4 w-4" /> Watch · 5 min
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border-b-2 border-transparent -mb-px hover:bg-muted"
          >
            <Headphones className="h-4 w-4" /> Listen · 8 min
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 py-4">
          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Article · {content.duration} min read · {content.moduleName}
            </span>
            <span>~{Math.max(1, Math.round((content.duration * (100 - READ_PROGRESS)) / 100))} min remaining</span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-secondary-foreground/60"
              style={{ width: `${READ_PROGRESS}%` }}
            />
          </div>

          {/* Mobile TOC */}
          <div className="mt-4 lg:hidden">
            <Select defaultValue={isDefaultArticle ? "part-b" : tocItems[0]?.id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jump to section" />
              </SelectTrigger>
              <SelectContent>
                {tocItems.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Article + TOC layout */}
          <div className="mt-6 flex gap-8">
            <article className="flex-1 max-w-[640px] space-y-6 text-[15px] leading-relaxed text-foreground">
              {!isDefaultArticle && (
                <ContentSections intro={content.intro} sections={content.sections} />
              )}
              {isDefaultArticle && (
                <>
              <section>
                <h3 className="text-lg font-bold mb-2">Part B Coverage Determination</h3>
                <p>
                  Medicare Part B covers medically necessary services and preventive services. When
                  determining coverage, the first step is to verify whether the service is a covered
                  benefit under the member's specific plan, and then apply{" "}
                  <KeyTerm
                    id="cob"
                    term="coordination of benefits"
                    title="Coordination of Benefits (COB):"
                    body="The process of determining which insurance plan pays first when a member has more than one plan."
                    openId={openId}
                    setOpenId={setOpenId}
                  />{" "}
                  rules where applicable.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Primary vs Secondary Coverage</h3>
                <p>
                  When a member has both Medicare and a secondary insurance plan,{" "}
                  <span className="relative inline">
                    <span className="bg-secondary/50 rounded px-0.5">{selectionQuote}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onAskAboutSelection(`Can you explain: '${selectionQuote}'?`)
                      }
                      className="ml-1 inline-flex items-center rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold align-middle hover:opacity-90"
                    >
                      Ask Sage about this
                    </button>
                  </span>
                  . The secondary plan may cover costs that Medicare doesn't, such as the 20%
                  coinsurance after Medicare pays.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Deductibles and Coinsurance</h3>
                <p>
                  The{" "}
                  <KeyTerm
                    id="part-b-deductible"
                    term="Part B deductible"
                    title="Part B Deductible:"
                    body="The amount a member pays before Medicare begins to pay. For 2026, the Part B deductible is $240."
                    openId={openId}
                    setOpenId={setOpenId}
                  />{" "}
                  resets each calendar year. Once the deductible is met, Medicare pays 80% of the
                  approved amount for covered services.
                </p>
              </section>
                </>
              )}
            </article>

            {/* Sticky TOC */}
            <aside className="hidden lg:block w-[180px] flex-shrink-0">
              <div className="sticky top-4 space-y-2">
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  On this page
                </div>
                {tocItems.map((i) => (
                  <a
                    key={i.id}
                    href={`#${i.id}`}
                    className={cn(
                      "block text-sm",
                      i.active
                        ? "text-primary font-medium underline"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {i.label}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Completion footer */}
      <div className="border-t border-border bg-card px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{READ_PROGRESS}% read</span>
            <div className="h-1.5 w-[100px] rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-secondary-foreground/60"
                style={{ width: `${READ_PROGRESS}%` }}
              />
            </div>
          </div>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="secondary" size="sm" disabled>
                    Mark as complete
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Continue reading to complete this session — 80% required
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Continue reading to complete this session
        </div>
      </div>
    </div>
  );
}