import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Layers,
  UserCheck,
  BookOpen,
  PlusSquare,
  ClipboardCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartBarInline } from "@/components/smart-teaming/SmartBar";

const defaultCards = [
  { icon: UserCircle, label: "Strengthen my skill gaps" },
  { icon: Layers, label: "Start a reflection" },
  { icon: UserCheck, label: "Practice a role play" },
  { icon: BookOpen, label: "Start my personalized upskilling" },
  { icon: PlusSquare, label: "Create a new upskilling space" },
  { icon: ClipboardCheck, label: "Self assess my skills" },
];

const rotatingTexts = [
  "What's your focus right now?",
  "What are we tackling today?",
  "What's on your mind?",
];

interface MainContentProps {
  staticHeading?: string;
  cards?: { icon: React.ElementType; label: string }[];
  navigateTo?: string;
}

export function MainContent({
  staticHeading,
  cards: cardsOverride,
  navigateTo = "/chat",
}: MainContentProps = {}) {
  const [textIndex, setTextIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (staticHeading) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [staticHeading]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    navigate(navigateTo, { state: { message } });
  };

  const cards = cardsOverride ?? defaultCards;

  return (
    <main className="flex-1 flex flex-col relative overflow-y-auto" aria-label="New chat">
      <div className="max-w-[800px] mx-auto w-full pt-12 pb-0 mt-[120px] sm:pt-0">
        <div className="mb-8" aria-live="polite" aria-atomic="true">
          {staticHeading ? (
            <h1 className="text-3xl font-semibold text-foreground tracking-tight inline-block">
              {staticHeading}
            </h1>
          ) : (
            <AnimatePresence mode="wait">
              <motion.h1
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-semibold text-foreground tracking-tight inline-block"
              >
                {rotatingTexts[textIndex]}
              </motion.h1>
            </AnimatePresence>
          )}
        </div>

        {/* Chat Input - between heading and cards */}
        <div className="mb-8">
          <SmartBarInline
            placeholder="Ask workforce AI..."
            showSparkle={false}
            micSize={24}
            micClassName="text-[hsl(var(--icon))] hover:text-foreground"
            onSend={(message) => handleSend(message)}
          />
          <p className="text-center mt-4 text-xs font-normal text-muted-foreground py-4 pt-0">
            AI can make mistakes. Check for accuracy.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[800px]">
          {cards.map((card) => (
            <ActionCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              onClick={() => handleSend(card.label)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ActionCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="ds-card-hover flex flex-row items-center gap-4 text-left p-4 bg-background rounded-[24px] border border-border h-[84px] w-full"
    >
      <Icon className="lucide text-accent flex-shrink-0 w-[24px] h-[24px]" strokeWidth={1.5} aria-hidden="true" />
      <span className="text-base font-normal text-foreground line-clamp-2">
        {label}
      </span>
    </motion.button>
  );
}
