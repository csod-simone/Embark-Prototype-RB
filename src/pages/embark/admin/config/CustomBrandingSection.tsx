import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/pages/embark/admin/Config";
import {
  HEX_RE,
  normaliseHex,
  useBranding,
  type BrandingState,
} from "@/hooks/use-branding";

const MAX_NAME = 30;
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/svg+xml", "image/jpeg"];
const HEX_ERROR = "Please enter a valid hex colour code (e.g. #3A6EA5).";

function ColourField({
  id,
  label,
  helper,
  value,
  onChange,
  error,
  onRevert,
}: {
  id: string;
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  error: string;
  onRevert?: () => void;
}) {
  const swatch = HEX_RE.test(value.trim()) ? normaliseHex(value) : "";
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <p className="text-xs text-muted-foreground">{helper}</p>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={value}
          placeholder="#000000"
          aria-invalid={Boolean(error)}
          className={error ? "max-w-[200px] border-destructive" : "max-w-[200px]"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-md border border-border bg-muted"
          style={swatch ? { backgroundColor: swatch } : undefined}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {onRevert && (
        <div>
          <Button variant="ghost" size="sm" onClick={onRevert}>
            Revert to original
          </Button>
        </div>
      )}
    </div>
  );
}

type RevertTarget = "logo" | "primary" | "secondary" | "tutorName";

const REVERT_COPY: Record<RevertTarget, { title: string; body: string }> = {
  logo: {
    title: "Revert to original logo?",
    body: "This will restore the default logo and remove your custom setting. This change will take effect when you save.",
  },
  primary: {
    title: "Revert to original primary colour?",
    body: "This will restore the default primary colour and remove your custom setting. This change will take effect when you save.",
  },
  secondary: {
    title: "Revert to original secondary colour?",
    body: "This will restore the default secondary colour and remove your custom setting. This change will take effect when you save.",
  },
  tutorName: {
    title: "Revert to original AI tutor name?",
    body: "This will restore the default AI tutor name and remove your custom setting. This change will take effect when you save.",
  },
};

export function CustomBrandingSection() {
  const navigate = useNavigate();
  const branding = useBranding();
  const fileRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState(branding.logoDataUrl);
  const [primary, setPrimary] = useState(branding.primaryHex);
  const [secondary, setSecondary] = useState(branding.secondaryHex);
  const [tutorName, setTutorName] = useState(branding.tutorName);
  const [logoError, setLogoError] = useState("");
  const [revertTarget, setRevertTarget] = useState<RevertTarget | null>(null);

  const savedLogo = Boolean(branding.logoDataUrl);
  const savedPrimary = Boolean(branding.primaryHex);
  const savedSecondary = Boolean(branding.secondaryHex);
  const savedTutorName = Boolean(branding.tutorName.trim()) && branding.tutorName.trim() !== "Sage";

  const confirmRevert = () => {
    if (revertTarget === "logo") removeLogo();
    if (revertTarget === "primary") setPrimary("");
    if (revertTarget === "secondary") setSecondary("");
    if (revertTarget === "tutorName") setTutorName("Sage");
    setRevertTarget(null);
  };

  const primaryError = primary.trim() === "" || HEX_RE.test(primary.trim()) ? "" : HEX_ERROR;
  const secondaryError = secondary.trim() === "" || HEX_RE.test(secondary.trim()) ? "" : HEX_ERROR;
  const nameError =
    tutorName.length > MAX_NAME ? `AI tutor name must be ${MAX_NAME} characters or fewer.` : "";

  const hasErrors = Boolean(logoError || primaryError || secondaryError || nameError);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type) || file.size > MAX_BYTES) {
      setLogoError("Please upload a PNG, SVG, or JPG file under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoError("");
      setLogo(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo("");
    setLogoError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = () => {
    if (hasErrors) return;
    const next: BrandingState = {
      logoDataUrl: logo,
      primaryHex: normaliseHex(primary),
      secondaryHex: normaliseHex(secondary),
      tutorName: tutorName.trim(),
    };
    branding.save(next);
    toast("Custom branding saved successfully.");
  };

  const handleCancel = () => {
    setLogo(branding.logoDataUrl);
    setPrimary(branding.primaryHex);
    setSecondary(branding.secondaryHex);
    setTutorName(branding.tutorName);
    setLogoError("");
    navigate("/admin/config");
  };

  const previewName = tutorName.trim() || "Sage";

  return (
    <div className="space-y-6" data-no-tutor-rename>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Custom Branding</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customise how the platform looks and feels for your learners. Upload your logo, set your
          brand colours, and rename the AI tutor.
        </p>
      </div>

      <SectionCard
        title="Logo"
        subtitle="Upload your organisation's logo to replace the default logo displayed in the top left of all pages."
      >
        <div className="space-y-3">
          <Input
            ref={fileRef}
            id="branding-logo"
            type="file"
            accept="image/png,image/svg+xml,image/jpeg"
            className={logoError ? "max-w-md border-destructive" : "max-w-md"}
            aria-label="Upload logo"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">
            Accepted formats: PNG, SVG, JPG · Maximum size: 2MB · Recommended size: 200 × 50px · Minimum: 100 × 25px
          </p>
          {logoError && <p className="text-xs text-destructive">{logoError}</p>}

          {logo && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Preview</p>
              <div className="inline-flex h-16 w-48 items-center justify-center rounded-md border border-border bg-muted p-2">
                <img src={logo} alt="Custom logo preview" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          )}
          {(logo || savedLogo) && (
            <div className="flex items-center gap-2">
              {logo && (
                <Button variant="ghost" size="sm" onClick={removeLogo}>
                  Remove logo
                </Button>
              )}
              {savedLogo && (
                <Button variant="ghost" size="sm" onClick={() => setRevertTarget("logo")}>
                  Revert to original
                </Button>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Colour Scheme"
        subtitle="Set your organisation's primary and secondary brand colours. These will be applied across the platform to buttons, navigation, highlights, and other key elements."
      >
        <div className="space-y-6">
          <ColourField
            id="branding-primary"
            label="Primary colour"
            helper="Applied to primary buttons, active navigation states, progress indicators, and key brand elements."
            value={primary}
            onChange={setPrimary}
            error={primaryError}
            onRevert={savedPrimary ? () => setRevertTarget("primary") : undefined}
          />
          <ColourField
            id="branding-secondary"
            label="Secondary colour"
            helper="Applied to secondary buttons, accent chips, tags, hover states, and supporting visual elements."
            value={secondary}
            onChange={setSecondary}
            error={secondaryError}
            onRevert={savedSecondary ? () => setRevertTarget("secondary") : undefined}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="AI Tutor Name"
        subtitle="Rename the AI tutor across the platform. The name you enter will replace 'Sage' everywhere it appears — in navigation, messages, prompts, and learner-facing content."
      >
        <div className="space-y-2">
          <Label htmlFor="branding-tutor-name">AI tutor name</Label>
          <p className="text-xs text-muted-foreground">
            This name will appear wherever 'Sage' is currently shown. Leave blank to keep the
            default name 'Sage'.
          </p>
          <Input
            id="branding-tutor-name"
            value={tutorName}
            placeholder="Sage"
            aria-invalid={Boolean(nameError)}
            className={nameError ? "max-w-[280px] border-destructive" : "max-w-[280px]"}
            onChange={(e) => setTutorName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {tutorName.length}/{MAX_NAME}
          </p>
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}

          {savedTutorName && (
            <div>
              <Button variant="ghost" size="sm" onClick={() => setRevertTarget("tutorName")}>
                Revert to original
              </Button>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground">Preview</p>
            <p className="text-sm text-foreground mt-1">Ask {previewName} a question</p>
          </div>
        </div>
      </SectionCard>

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={hasErrors}>
          Save
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <AlertDialog open={revertTarget !== null} onOpenChange={(open) => !open && setRevertTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{revertTarget ? REVERT_COPY[revertTarget].title : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              {revertTarget ? REVERT_COPY[revertTarget].body : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevert}>Revert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
