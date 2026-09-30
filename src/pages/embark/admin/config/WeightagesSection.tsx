import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionCard } from "@/pages/embark/admin/Config";
import { useWeightages, type ReadinessBand, type WeightComponent } from "@/hooks/use-weightages";

const isInt = (v: string) => /^\d+$/.test(v.trim());

export function WeightagesSection() {
  const navigate = useNavigate();
  const { components, bands, save } = useWeightages();

  const [weightDrafts, setWeightDrafts] = useState<string[]>(() =>
    components.map((c) => String(c.weight)),
  );
  const [bandDrafts, setBandDrafts] = useState(() =>
    bands.map((b) => ({ min: String(b.min), label: b.label })),
  );

  const weightErrors = weightDrafts.map((v) => {
    if (!isInt(v)) return "Enter a whole number between 0 and 100.";
    const n = Number(v);
    if (n < 0 || n > 100) return "Enter a whole number between 0 and 100.";
    return "";
  });

  const total = useMemo(
    () => weightDrafts.reduce((sum, v) => sum + (isInt(v) ? Number(v) : 0), 0),
    [weightDrafts],
  );
  const totalInvalid = weightErrors.some(Boolean) || total !== 100;

  const thresholdErrors = bandDrafts.map((b, i) => {
    if (i === 3) return "";
    if (!isInt(b.min)) return "Enter a whole number between 1 and 99.";
    const n = Number(b.min);
    if (n < 1 || n > 99) return "Enter a whole number between 1 and 99.";
    if (i > 0) {
      const above = bandDrafts[i - 1].min;
      if (isInt(above) && n >= Number(above))
        return "Must be lower than the band above.";
    }
    return "";
  });

  const labelErrors = bandDrafts.map((b) =>
    b.label.trim() === "" ? "Status label is required." : "",
  );

  const hasErrors =
    totalInvalid || thresholdErrors.some(Boolean) || labelErrors.some(Boolean);

  const rangeLabel = (i: number) => {
    const min = bandDrafts[i].min;
    if (i === 3) return `<${bandDrafts[2].min || "0"}`;
    if (i === 0) return `${min || "0"}\u2013100`;
    const above = Number(bandDrafts[i - 1].min);
    const upper = Number.isFinite(above) ? above - 1 : 0;
    return `${min || "0"}\u2013${upper}`;
  };

  const reset = () => {
    setWeightDrafts(components.map((c) => String(c.weight)));
    setBandDrafts(bands.map((b) => ({ min: String(b.min), label: b.label })));
  };

  const handleSave = () => {
    if (hasErrors) return;
    const nextComponents: WeightComponent[] = components.map((c, i) => ({
      ...c,
      weight: Number(weightDrafts[i]),
    }));
    const nextBands: ReadinessBand[] = bands.map((b, i) => ({
      ...b,
      min: i === 3 ? 0 : Number(bandDrafts[i].min),
      label: bandDrafts[i].label.trim(),
    }));
    save({ components: nextComponents, bands: nextBands });
    toast("Weightages saved successfully.");
  };

  const handleCancel = () => {
    reset();
    navigate("/admin/config");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Weightages</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how the Readiness Score is calculated and define the thresholds and labels for
          each Readiness Band.
        </p>
      </div>

      <SectionCard
        title="Readiness Score"
        subtitle="Set the percentage weighting for each component that contributes to the Readiness Score. Weightings must total 100%."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead className="w-[180px]">Weighting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((c, i) => (
              <TableRow key={c.id}>
                <TableCell className="text-sm text-foreground">{c.label}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input
                      inputMode="numeric"
                      aria-label={`${c.label} weighting`}
                      aria-invalid={Boolean(weightErrors[i])}
                      className={weightErrors[i] ? "w-20 border-destructive" : "w-20"}
                      value={weightDrafts[i]}
                      onChange={(e) =>
                        setWeightDrafts((prev) =>
                          prev.map((v, idx) => (idx === i ? e.target.value : v)),
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  {weightErrors[i] && (
                    <p className="mt-1 text-xs text-destructive">{weightErrors[i]}</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell className="text-sm font-semibold text-foreground">Total</TableCell>
              <TableCell className="text-sm font-semibold text-foreground">{total}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {total !== 100 && (
          <p className="mt-2 text-xs text-destructive">
            Weightings must total 100%. Current total: {total}%.
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Readiness Bands"
        subtitle="Configure the score threshold and status label for each readiness band. Thresholds define the minimum score required for each band."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Band</TableHead>
              <TableHead>Score Range</TableHead>
              <TableHead>Status Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bandDrafts.map((b, i) => (
              <TableRow key={bands[i].id}>
                <TableCell className="text-sm text-foreground">{i + 1}</TableCell>
                <TableCell>
                  {i === 3 ? (
                    <span className="text-sm text-muted-foreground">{rangeLabel(i)}</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Input
                          inputMode="numeric"
                          aria-label={`Band ${i + 1} minimum threshold`}
                          aria-invalid={Boolean(thresholdErrors[i])}
                          className={thresholdErrors[i] ? "w-20 border-destructive" : "w-20"}
                          value={b.min}
                          onChange={(e) =>
                            setBandDrafts((prev) =>
                              prev.map((row, idx) =>
                                idx === i ? { ...row, min: e.target.value } : row,
                              ),
                            )
                          }
                        />
                        <span className="text-sm text-muted-foreground">{rangeLabel(i)}</span>
                      </div>
                      {thresholdErrors[i] && (
                        <p className="mt-1 text-xs text-destructive">{thresholdErrors[i]}</p>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    aria-label={`Band ${i + 1} status label`}
                    aria-invalid={Boolean(labelErrors[i])}
                    maxLength={40}
                    className={labelErrors[i] ? "max-w-[240px] border-destructive" : "max-w-[240px]"}
                    value={b.label}
                    onChange={(e) =>
                      setBandDrafts((prev) =>
                        prev.map((row, idx) =>
                          idx === i ? { ...row, label: e.target.value } : row,
                        ),
                      )
                    }
                  />
                  {labelErrors[i] && (
                    <p className="mt-1 text-xs text-destructive">{labelErrors[i]}</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={hasErrors}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default WeightagesSection;