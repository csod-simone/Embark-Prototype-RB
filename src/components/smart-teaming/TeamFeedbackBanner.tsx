import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageSquare, Send, CheckCircle } from "lucide-react";

interface TeamFeedbackBannerProps {
  teamName: string;
  teamId: string;
  onDismiss: (teamId: string) => void;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground w-24 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={16}
              className={`transition-colors ${
                star <= (hover || value)
                  ? "text-star fill-star"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-muted-foreground">
          {value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Good" : value === 4 ? "Very good" : "Excellent"}
        </span>
      )}
    </div>
  );
}

export function TeamFeedbackBanner({ teamName, teamId, onDismiss }: TeamFeedbackBannerProps) {
  const [teamFit, setTeamFit] = useState(0);
  const [skillsAlignment, setSkillsAlignment] = useState(0);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onDismiss(teamId), 2000);
  };

  const canSubmit = teamFit > 0 && skillsAlignment > 0;

  return (
    <AnimatePresence>
      {!submitted ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-primary/5 border border-primary/15 rounded-2xl p-4 relative"
        >
          <button
            onClick={() => onDismiss(teamId)}
            aria-label="Dismiss feedback"
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Star size={16} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  How is <span className="text-primary">{teamName}</span> performing?
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your feedback helps improve future team recommendations
                </p>
              </div>

              <div className="space-y-2">
                <StarRating value={teamFit} onChange={setTeamFit} label="Team fit" />
                <StarRating value={skillsAlignment} onChange={setSkillsAlignment} label="Skills alignment" />
              </div>

              <div className="flex items-center gap-2">
                {!showComment && (
                  <button
                    onClick={() => setShowComment(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare size={12} />
                    Add a comment
                  </button>
                )}

                {showComment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex-1"
                  >
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Any specific observations about team dynamics, skill gaps, or collaboration..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </motion.div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="ml-auto px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  <Send size={12} />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle size={16} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Thanks for your feedback! It'll help us build better teams.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
