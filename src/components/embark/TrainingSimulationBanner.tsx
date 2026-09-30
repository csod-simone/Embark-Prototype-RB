/** Training-only disclaimer shown on AI simulation surfaces (WAI workforce roleplay pattern). */
export function TrainingSimulationBanner() {
  return (
    <div
      className="border-b border-corange-200 bg-corange-100 px-4 py-2 text-center text-[11px] leading-snug text-corange-900 sm:text-xs dark:border-corange-800 dark:bg-corange-950/60 dark:text-corange-100"
      role="note"
    >
      Training simulation only. Use fictional information — follow applicable organisational policy
      — do not enter real personal or confidential data.
    </div>
  );
}
