import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle, Users, Send } from "lucide-react";

interface DeploySuccessDialogProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  memberCount: number;
}

export function DeploySuccessDialog({ open, onClose, teamName, memberCount }: DeploySuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-border">
        {/* Illustration area */}
        <div className="bg-primary/5 px-8 pt-10 pb-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Team deployed!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your dynamic team is ready to go
            </p>
          </motion.div>
        </div>

        {/* Details */}
        <div className="px-8 pb-8 pt-4 space-y-4">
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{teamName}</p>
                <p className="text-sm text-muted-foreground">{memberCount} members notified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Invitations sent</p>
                <p className="text-sm text-muted-foreground">All team members will receive an email shortly</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
