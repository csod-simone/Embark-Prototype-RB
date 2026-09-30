import { useState } from "react";
import { ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { TutorPanel } from "./TutorPanel";
import type { TutorConversation } from "./useTutorConversation";

export function TutorBottomDrawer({ conversation }: { conversation: TutorConversation }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Collapsed pill fixed above mobile tab bar (68px) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-0 right-0 bottom-[68px] z-40 h-[72px] bg-card border-t border-border rounded-t-xl px-4 flex items-center gap-3 text-left shadow-lg lg:hidden"
          aria-label="Open Sage"
        >
          <div
            aria-hidden="true"
            className="h-9 w-9 rounded-full flex-shrink-0 inline-flex items-center justify-center bg-primary/15 text-primary"
          >
            <AskSageIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground">Sage</div>
            <div className="text-xs text-muted-foreground truncate">
              {conversation.lastTutorMessage}
            </div>
          </div>
          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </button>
      )}

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              ← Back to journey
            </Button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <TutorPanel conversation={conversation} />
          </div>
        </div>
      )}
    </>
  );
}