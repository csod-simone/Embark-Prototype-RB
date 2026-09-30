import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { helpRequests } from "@/data/mockData";
import { learnersForCohort } from "@/pages/embark/admin/cohorts/enrollmentData";
import { cn } from "@/lib/utils";

export function HelpTab({
  respondedIds,
  onSendResponse,
  focusId,
}: {
  respondedIds: Set<string>;
  onSendResponse: (id: string) => void;
  focusId?: string | null;
}) {
  const { cohortId } = useParams();
  const ids = new Set(learnersForCohort(cohortId).map((learner) => learner.id));
  const requests = helpRequests.filter((hr) => ids.has(hr.learnerId));
  return (
    <div className="p-4 space-y-4">
      {requests.map((hr) => {
        const isJordan = hr.id === "hr1";
        const responded = respondedIds.has(hr.id);
        const variant = responded ? "success" : isJordan ? "warning" : "danger";
        return (
          <LeftBorderCard key={hr.id} borderVariant={variant as any}>
            <HelpCardBody
              hr={hr}
              responded={responded}
              onSend={() => onSendResponse(hr.id)}
              autoFocus={focusId === hr.id}
            />
          </LeftBorderCard>
        );
      })}
    </div>
  );
}

function HelpCardBody({
  hr,
  responded,
  onSend,
  autoFocus,
}: {
  hr: (typeof helpRequests)[number];
  responded: boolean;
  onSend: () => void;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const [resolved, setResolved] = useState(false);
  const isJordan = hr.id === "hr1";
  const learnerRoute = `/manager/learner/${hr.learnerId}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            Hand raised
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              responded
                ? "bg-secondary/60 text-secondary-foreground"
                : isJordan
                ? "bg-warning/15 text-warning-foreground dark:text-warning"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {responded ? "ACKNOWLEDGED" : "OPEN"}
          </span>
          {hr.aiSuggested && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-muted text-muted-foreground">
              AI-suggested
            </span>
          )}
        </div>
        <span
          className={cn(
            "text-xs flex items-center gap-1",
            !responded && !isJordan ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {!responded && !isJordan && <Clock className="h-3 w-3" />}
          {isJordan
            ? "Raised 2 hours ago"
            : "Raised 2 days ago — ⚠ Unacknowledged 28 hours"}
        </span>
      </div>

      <div>
        <div className="text-sm font-medium text-foreground">{hr.learnerName}</div>
        <div className="text-xs text-muted-foreground">
          {hr.moduleName} — {hr.sessionName}
        </div>
      </div>

      <p className="text-sm text-foreground">
        {hr.message.length > 140 ? `${hr.message.slice(0, 140)}…` : hr.message}
      </p>

      {hr.tutorContext.length > 0 && (
        <InlineExpandRow
          trigger={
            <span className="text-xs text-secondary-foreground">View full Sage context</span>
          }
          content={
            <div className="space-y-2">
              {hr.tutorContext.map((m, i) =>
                m.role === "tutor" ? (
                  <TutorBubble key={i} message={m.text} />
                ) : (
                  <LearnerBubble key={i} message={m.text} />
                ),
              )}
              <a href="#" className="text-xs text-secondary-foreground hover:underline">
                View full transcript ↗
              </a>
            </div>
          }
        />
      )}

      {responded ? (
        <div className="flex items-center gap-2 text-sm text-success-dark">
          <Check className="h-4 w-4" />
          <span>Response sent · Jul 19, 2026 at 2:31 PM</span>
        </div>
      ) : (
        isJordan && (
          <div className="space-y-2 rounded-md border border-border p-3 bg-background">
            <Textarea
              autoFocus={autoFocus}
              placeholder="Write your response to Jordan..."
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={onSend} disabled={!text.trim()}>
                  Send Response
                </Button>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={resolved} onCheckedChange={setResolved} />
                  Mark Resolved
                </label>
              </div>
              <button className="text-xs text-muted-foreground hover:underline">
                Acknowledge only
              </button>
            </div>
          </div>
        )
      )}

      <div className="flex items-center justify-between pt-1">
        {!responded ? (
          <Button
            size="sm"
            variant={isJordan ? "default" : "outline"}
            className={!isJordan ? "border-destructive text-destructive hover:bg-destructive/10" : ""}
            onClick={onSend}
          >
            Respond
          </Button>
        ) : <span />}
        <Link
          to={learnerRoute}
          className="text-xs text-muted-foreground hover:underline"
        >
          View {hr.learnerName.split(" ")[0]}'s profile →
        </Link>
      </div>
    </div>
  );
}