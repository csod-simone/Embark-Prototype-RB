export function LearnerBubble({
  message,
  timestamp,
}: {
  message: string;
  timestamp?: string;
}) {
  return (
    <div className="flex flex-col items-end gap-1 max-w-[80%] ml-auto">
      <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm">
        {message}
      </div>
      {timestamp && <span className="text-[11px] text-muted-foreground pr-2">{timestamp}</span>}
    </div>
  );
}