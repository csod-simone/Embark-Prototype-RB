import { useState } from "react";
import { Check, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { approvals } from "@/data/mockData";

export function ApprovalsTab({
  decidedSkips,
  onDecideSkip,
  decidedRetakes,
  onDecideRetake,
  onSwitchToHelp,
}: {
  decidedSkips: Set<string>;
  onDecideSkip: (id: string) => void;
  decidedRetakes: Set<string>;
  onDecideRetake: (id: string) => void;
  onSwitchToHelp: () => void;
}) {
  const [revertedSkips, setRevertedSkips] = useState<Set<string>>(new Set());

  return (
    <div className="p-4 space-y-8">


      <SectionHeader label="Module skip reviews" count={approvals.moduleSkips.filter(s => !decidedSkips.has(s.id)).length} variant="warning" countSuffix="to review" />
      <div className="space-y-3">
        {approvals.moduleSkips.map((s) =>
          decidedSkips.has(s.id) ? (
            revertedSkips.has(s.id) ? (
              <RevertedRow key={s.id} text="↩ Skip reverted — module restored to Priya's journey" />
            ) : (
              <SuccessRow key={s.id} text="✓ Skip accepted — logged in audit trail" />
            )
          ) : (
            <SkipCard
              key={s.id}
              skip={s}
              onAccept={() => onDecideSkip(s.id)}
              onRevert={() => {
                setRevertedSkips((p) => new Set(p).add(s.id));
                onDecideSkip(s.id);
              }}
            />
          ),
        )}
      </div>


      <SectionHeader label="Retake approvals" count={approvals.retakes.filter(s => !decidedRetakes.has(s.id)).length} variant="warning" />
      <div className="space-y-3">
        {approvals.retakes.map((r) =>
          decidedRetakes.has(r.id) ? (
            <SuccessRow key={r.id} text="Retake approved — logged in audit trail" />
          ) : (
            <RetakeCard key={r.id} retake={r} onDecide={() => onDecideRetake(r.id)} />
          ),
        )}
      </div>

      <SectionHeader label="Coaching approvals" />
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Inbox className="h-6 w-6 mb-2" />
        <div className="text-sm">No coaching assignment approvals pending.</div>
      </div>
    </div>
  );
}

function SectionHeader({ label, count, variant, countSuffix = "pending" }: { label: string; count?: number; variant?: "brand" | "warning"; countSuffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-foreground">{label}</h3>
      {count !== undefined && count > 0 && (
        <span
          className={
            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
            (variant === "warning"
              ? "bg-warning/15 text-warning-foreground dark:text-warning"
              : "bg-secondary/60 text-secondary-foreground")
          }
        >
          {count} {countSuffix}
        </span>
      )}
    </div>
  );
}


function SkipCard({
  skip,
  onAccept,
  onRevert,
}: {
  skip: (typeof approvals.moduleSkips)[number];
  onAccept: () => void;
  onRevert: () => void;
}) {
  const [confirmRevert, setConfirmRevert] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="text-sm font-medium text-foreground">{skip.learnerName}</div>
      <div className="text-xs text-muted-foreground">Module skipped: {skip.moduleName}</div>
      <p className="text-xs text-foreground">
        This skip has been applied to Priya's journey. Review the AI rationale below and revert it if you disagree.
      </p>
      <div className="rounded-md bg-muted/50 p-3 text-xs italic text-muted-foreground">
        {skip.rationale}
      </div>
      <div className="text-xs text-muted-foreground">Applied: Jul 18, 2026</div>
      {confirmRevert ? (
        <div className="space-y-2">
          <p className="text-xs text-foreground">
            Reverting this skip will add the module back to Priya's journey immediately. She will be notified.
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="destructive" onClick={onRevert}>Yes, revert</Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirmRevert(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAccept}>Accept skip</Button>
          <Button size="sm" variant="secondary" onClick={() => setConfirmRevert(true)}>Revert skip</Button>
        </div>
      )}
      <div className="text-[11px] text-muted-foreground">
        Both actions are logged in the audit trail. You have 7 days from the applied date to revert this skip.
      </div>
    </div>
  );
}

function RetakeCard({
  retake,
  onDecide,
}: {
  retake: (typeof approvals.retakes)[number];
  onDecide: () => void;
}) {
  const [denyOpen, setDenyOpen] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="text-sm font-medium text-foreground">{retake.learnerName}</div>
      <div className="text-xs text-muted-foreground">
        Module: {retake.moduleName} · Attempt {retake.attemptNumber} · Current score: {retake.currentScore}%
      </div>
      <div className="text-xs text-muted-foreground">Requested: Jul 19, 2026</div>
      {denyOpen ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Reason for denial (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-9"
          />
          <Button size="sm" onClick={onDecide}>Confirm denial</Button>
          <Button size="sm" variant="outline" onClick={() => setDenyOpen(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onDecide}>Approve Retake</Button>
          <Button size="sm" variant="secondary" onClick={() => setDenyOpen(true)}>Deny</Button>
        </div>
      )}
    </div>
  );
}

function SuccessRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-success-dark/30 bg-success-dark/5 p-3 text-sm text-success-dark">
      <Check className="h-4 w-4" />
      {text}
    </div>
  );
}

function RevertedRow({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm text-warning-foreground dark:text-warning">
      {text}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <div className="text-sm text-muted-foreground">{text}</div>;
}