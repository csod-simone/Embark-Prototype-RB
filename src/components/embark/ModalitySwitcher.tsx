import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODALITY_LABEL, type Modality } from "@/lib/modality";

export function ModalitySwitcher({
  available,
  value,
  onChange,
  ariaLabel = "Choose content format",
}: {
  available: Modality[];
  value: Modality;
  onChange: (m: Modality) => void;
  ariaLabel?: string;
}) {
  if (available.length <= 1) return null;
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as Modality)}
      aria-label={ariaLabel}
    >
      <TabsList className="h-8">
        {available.map((m) => (
          <TabsTrigger key={m} value={m} className="text-xs px-2.5 py-1 h-6">
            {MODALITY_LABEL[m]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
