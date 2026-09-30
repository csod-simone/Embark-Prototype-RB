import { useState } from "react";
import { X, Plus, Sparkles, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface InferredSkills {
  aiInferred: string[];
  documentInferred: string[];
  additional: string[];
}

interface EditSkillsDialogProps {
  open: boolean;
  onClose: () => void;
  skills: InferredSkills;
  onSave: (skills: InferredSkills) => void;
}

export function EditSkillsDialog({ open, onClose, skills, onSave }: EditSkillsDialogProps) {
  const [aiSkills, setAiSkills] = useState<string[]>(skills.aiInferred);
  const [docSkills, setDocSkills] = useState<string[]>(skills.documentInferred);
  const [additionalSkills, setAdditionalSkills] = useState<string[]>(skills.additional);
  const [newSkill, setNewSkill] = useState("");

  const removeSkill = (list: string[], setList: (v: string[]) => void, skill: string) => {
    setList(list.filter((s) => s !== skill));
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !additionalSkills.includes(trimmed)) {
      setAdditionalSkills([...additionalSkills, trimmed]);
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = () => {
    onSave({ aiInferred: aiSkills, documentInferred: docSkills, additional: additionalSkills });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Edit inferred skills
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Review and adjust the skills used for team matching
          </p>
        </DialogHeader>

        <div className="px-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* AI Inferred */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <p className="text-sm font-semibold text-foreground tracking-wider">AI-inferred skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(aiSkills, setAiSkills, skill)}
                    aria-label={`Remove ${skill}`}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {aiSkills.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No AI-inferred skills</p>
              )}
            </div>
          </div>

          {/* Document Inferred */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              <p className="text-sm font-semibold text-foreground tracking-wider">Document-inferred skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {docSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(docSkills, setDocSkills, skill)}
                    aria-label={`Remove ${skill}`}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {docSkills.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No document-inferred skills</p>
              )}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground tracking-wider">Additional skills</p>
            <div className="flex flex-wrap gap-2">
              {additionalSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(additionalSkills, setAdditionalSkills, skill)}
                    aria-label={`Remove ${skill}`}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
