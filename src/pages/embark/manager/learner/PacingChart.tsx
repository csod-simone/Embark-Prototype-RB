import type { LearnerRecord } from "@/data/learnerDirectory";

export function PacingChart({ learner }: { learner: LearnerRecord }) {
  const firstName = learner.name.split(" ")[0];
  // Chart geometry
  const W = 400;
  const H = 160;
  const padL = 30;
  const padR = 10;
  const padT = 10;
  const padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xForDay = (d: number) => padL + ((d - 1) / 14) * innerW;
  const yForPct = (p: number) => padT + innerH - (p / 100) * innerH;

  // Expected: linear 0 → 100 over days 1–15
  const expected = [
    [1, 0],
    [15, 100],
  ] as const;

  // This learner's actual pacing, days 1–5.
  const actual = learner.pacing.map((p) => [p.day, p.pct] as const);
  const latest = actual[actual.length - 1] ?? ([1, 0] as const);

  // Cohort avg: at day 5 = ~38
  const cohort = [
    [1, 0],
    [2, 10],
    [3, 20],
    [4, 29],
    [5, 38],
  ] as const;

  const toPoints = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([d, p]) => `${xForDay(d)},${yForPct(p)}`).join(" ");

  const xTicks = [1, 5, 10, 15];
  const yTicks = [0, 50, 100];

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-xs tracking-wide font-medium text-muted-foreground mb-3">
        Pacing vs. expected
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto max-h-36 w-full" role="img" aria-label="Pacing chart">
        {/* Grid Y ticks + labels */}
        {yTicks.map((y) => (
          <g key={`y-${y}`}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yForPct(y)}
              y2={yForPct(y)}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={yForPct(y) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              style={{ fontSize: 9 }}
            >
              {y}%
            </text>
          </g>
        ))}
        {/* X ticks + labels */}
        {xTicks.map((x) => (
          <g key={`x-${x}`}>
            <line
              x1={xForDay(x)}
              x2={xForDay(x)}
              y1={padT + innerH}
              y2={padT + innerH + 4}
              stroke="hsl(var(--border))"
            />
            <text
              x={xForDay(x)}
              y={padT + innerH + 14}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 9 }}
            >
              Day {x}
            </text>
          </g>
        ))}

        {/* Expected — dashed muted */}
        <polyline
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          points={toPoints(expected)}
        />
        {/* Cohort avg — dashed secondary */}
        <polyline
          fill="none"
          stroke="hsl(var(--secondary-foreground))"
          strokeWidth={1.5}
          strokeDasharray="2 3"
          points={toPoints(cohort)}
        />
        {/* This learner — solid warning */}
        <polyline
          fill="none"
          stroke="hsl(var(--warning))"
          strokeWidth={2}
          points={toPoints(actual)}
        />
        {/* Today marker */}
        <circle cx={xForDay(latest[0])} cy={yForPct(latest[1])} r={3.5} fill="hsl(var(--warning))" />
      </svg>
      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
        <LegendSwatch color="hsl(var(--muted-foreground))" dashed label="Expected" />
        <LegendSwatch color="hsl(var(--warning))" label={firstName} />
        <LegendSwatch color="hsl(var(--secondary-foreground))" dashed label="Cohort avg." />
      </div>
    </section>
  );
}

function LegendSwatch({
  color,
  dashed,
  label,
}: {
  color: string;
  dashed?: boolean;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width={24} height={6} aria-hidden="true">
        <line
          x1={0}
          x2={24}
          y1={3}
          y2={3}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? "3 2" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}