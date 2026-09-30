export function TopSkillsCard() {
  const skills = [
    { name: "Product Strategy", value: 0.85 },
    { name: "Data Analysis", value: 0.65 },
    { name: "Stakeholder Mgmt", value: 0.78 },
    { name: "Technical Writing", value: 0.55 },
    { name: "User Research", value: 0.72 },
    { name: "Roadmap Planning", value: 0.80 },
  ];

  const assessedBy = ["Self", "Peer", "AI"];

  // Simple radar chart using SVG
  const center = 90;
  const radius = 70;
  const angleStep = (2 * Math.PI) / skills.length;

  const points = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * skill.value;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div>
      <h3
        className="text-lg font-semibold text-foreground mb-4"
       
      >
        Top skills
      </h3>

      <div className="flex gap-6">
        {/* Radar Chart */}
        <div className="flex-shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" aria-label="Skills radar chart">
            {/* Grid */}
            {rings.map((ring) => {
              const ringPoints = skills
                .map((_, i) => {
                  const angle = i * angleStep - Math.PI / 2;
                  const r = radius * ring;
                  return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                })
                .join(" ");
              return (
                <polygon
                  key={ring}
                  points={ringPoints}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
              );
            })}
            {/* Axes */}
            {skills.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={center + radius * Math.cos(angle)}
                  y2={center + radius * Math.sin(angle)}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
              );
            })}
            {/* Data polygon */}
            <polygon
              points={polygonPoints}
              fill="hsl(var(--primary) / 0.15)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="hsl(var(--primary))"
              />
            ))}
            {/* Center dot */}
            <circle cx={center} cy={center} r="5" fill="hsl(var(--primary))" />
          </svg>
        </div>

        {/* Skill details */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Product Strategy
            </p>
            <p className="text-sm text-foreground font-medium mt-0.5">Technical</p>
          </div>

          <div>
            <p className="text-sm text-foreground font-medium mb-1.5">Assessed by</p>
            <div className="flex gap-1.5">
              {assessedBy.map((source) => (
                <span
                  key={source}
                  className="text-sm font-medium border border-border rounded-md px-2 py-0.5 text-foreground"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-foreground font-medium mb-2">Proficiency gap analysis</p>
            <div className="relative">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "55%" }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-muted-foreground">Intermediate</span>
                <span className="text-xs text-muted-foreground">Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
