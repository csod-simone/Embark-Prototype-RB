import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionImage } from "./assessmentStubs";

export type RichContentPatch = {
  scenario?: string;
  image?: QuestionImage;
};

/**
 * Scenario context and image / screenshot authoring for a question, with
 * optional text before and after the image. Images are stored as data URLs
 * in the prototype.
 */
export function QuestionRichContentFields({
  id,
  scenario,
  image,
  subject = "question",
  onChange,
}: {
  id: string;
  scenario?: string;
  image?: QuestionImage;
  subject?: "question" | "section";
  onChange: (patch: RichContentPatch) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showScenario, setShowScenario] = useState(!!scenario);
  const [showImage, setShowImage] = useState(!!image);

  const setImage = (patch: Partial<QuestionImage>) =>
    onChange({ scenario, image: { src: "", alt: "", ...image, ...patch } });

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({ src: String(reader.result), alt: image?.alt || file.name.replace(/\.[^.]+$/, "") });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {!showScenario && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowScenario(true)}>
            + Add scenario
          </Button>
        )}
        {!showImage && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowImage(true)}>
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Add image or screenshot
          </Button>
        )}
      </div>

      {showScenario && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`qscn-${id}`} className="text-sm">Scenario / case context</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Remove scenario"
              onClick={() => {
                setShowScenario(false);
                onChange({ scenario: undefined, image });
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <Textarea
            id={`qscn-${id}`}
            value={scenario ?? ""}
            onChange={(e) => onChange({ scenario: e.target.value, image })}
            placeholder="Describe the situation the learner is responding to."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Formatting: **bold**, _italic_, blank line for a new paragraph, “- ” for bullets,
            “1. ” for numbering, and leading spaces for indentation.
          </p>
        </div>
      )}

      {showImage && (
        <div className="space-y-2 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Image or screenshot</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Remove image"
              onClick={() => {
                setShowImage(false);
                onChange({ scenario, image: undefined });
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`qimg-before-${id}`} className="text-xs text-muted-foreground">Text before image</Label>
            <Input
              id={`qimg-before-${id}`}
              value={image?.textBefore ?? ""}
              onChange={(e) => setImage({ textBefore: e.target.value })}
              placeholder="e.g. Review the claim summary below."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {image?.src ? "Replace image" : `Upload ${subject} image`}
            </Button>
            {image?.src && (
              <img src={image.src} alt={image.alt || `${subject === "section" ? "Section" : "Question"} image preview`} className="h-16 rounded border border-border object-contain" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`qimg-alt-${id}`} className="text-xs text-muted-foreground">
              Alt text (describes the image for screen readers)
            </Label>
            <Input
              id={`qimg-alt-${id}`}
              value={image?.alt ?? ""}
              onChange={(e) => setImage({ alt: e.target.value })}
              placeholder="e.g. Claim summary showing a $250 deductible applied"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`qimg-after-${id}`} className="text-xs text-muted-foreground">Text after image</Label>
            <Input
              id={`qimg-after-${id}`}
              value={image?.textAfter ?? ""}
              onChange={(e) => setImage({ textAfter: e.target.value })}
              placeholder="e.g. Based on this, what should the CSR tell the member?"
            />
          </div>
        </div>
      )}
    </div>
  );
}
