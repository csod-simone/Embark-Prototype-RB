import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CitationType } from "@/data/mockData";
import { matchSageResponse } from "./sageResponses";

export type TutorMsg = {
  id: string;
  role: "tutor" | "learner";
  text: string;
  timestamp: string;
  citation?: CitationType;
  isProactive?: boolean;
  isTyping?: boolean;
  inlineCta?: { label: string; route: string };
};

const initialMessages: TutorMsg[] = [
  {
    id: "m1",
    role: "tutor",
    timestamp: "Sage · just now",
    text: "Welcome back. You're on the Investment Manager Full Onboarding Journey, currently in the IM Intake Pathway. Continue from the session where you left off.",
  },
  {
    id: "m2",
    role: "tutor",
    isProactive: true,
    timestamp: "Sage · just now",
    text: "Quick check-in before you dive in — how are you feeling about the Medicare coverage concepts from yesterday's sessions?",
  },
  {
    id: "m3",
    role: "learner",
    timestamp: "Jordan · just now",
    text: "Mostly okay, but Part B deductibles with secondary insurance are still a bit confusing",
  },
  {
    id: "m4",
    role: "tutor",
    timestamp: "Sage · just now",
    text: "That's a common one. Let's make sure it clicks before the assessment. I'll flag it as a focus area for today. When you're ready, tap 'What's next?' below and I'll walk you through it.",
  },
];

let nextId = 100;
const genId = () => `msg-${nextId++}`;

export function useTutorConversation(seed?: TutorMsg[]) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<TutorMsg[]>(seed ?? initialMessages);

  const append = useCallback((msg: Omit<TutorMsg, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: genId() }]);
  }, []);

  const replaceTyping = useCallback(
    (typingId: string, msg: Omit<TutorMsg, "id">) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { ...msg, id: typingId } : m)),
      );
    },
    [],
  );

  const showTypingThen = useCallback(
    (reply: Omit<TutorMsg, "id">, delay = 1000) => {
      const typingId = genId();
      setMessages((prev) => [
        ...prev,
        { id: typingId, role: "tutor", text: "", timestamp: "", isTyping: true },
      ]);
      window.setTimeout(() => replaceTyping(typingId, reply), delay);
    },
    [replaceTyping],
  );

  const handleWhatsNext = useCallback(() => {
    append({ role: "learner", text: "What's next?", timestamp: "Jordan · just now" });
    showTypingThen({
      role: "tutor",
      text: "Your next step is Benefits Lookup Practice — a 10-minute role play session in Module 3. Want to go there now?",
      timestamp: "Sage · just now",
      inlineCta: { label: "Take me there →", route: "/learner/role-play/s3" },
    });
  }, [append, showTypingThen]);

  const handleSummariseArticle = useCallback(() => {
    append({ role: "learner", text: "Summarise this article", timestamp: "Jordan · just now" });
    showTypingThen({
      role: "tutor",
      text:
        "Here's a summary of Coverage Determination:\n\n" +
        "Part B covers medically necessary services. Once the annual deductible is met ($240 for 2026), Medicare pays 80% of approved amounts.\n\n" +
        "Coordination of Benefits (COB): When a member has secondary insurance, Medicare pays first. The secondary plan may cover the remaining 20% depending on the plan terms.\n\n" +
        "Key rule: Always verify the COB record before telling a member what they owe.",
      timestamp: "Sage · just now",
      citation: "curriculum",
    });
  }, [append, showTypingThen]);

  const handleSend = useCallback(
    (text: string, presetReply?: string) => {
      append({ role: "learner", text, timestamp: "Jordan · just now" });
      if (presetReply) {
        showTypingThen({
          role: "tutor",
          text: presetReply,
          timestamp: "Sage · just now",
        });
        return;
      }
      const matched = matchSageResponse(text);
      if (matched) {
        showTypingThen({
          role: "tutor",
          text: matched,
          timestamp: "Sage · just now",
        });
        return;
      }
      showTypingThen({
        role: "tutor",
        text: "Good question. Let me look that up in your curriculum...",
        timestamp: "Sage · just now",
        citation: "curriculum",
      });
    },
    [append, showTypingThen],
  );


  const handleRaiseHand = useCallback(() => navigate("/learner/help"), [navigate]);

  const handleSkip = useCallback(() => {
    append({ role: "learner", text: "Skipped", timestamp: "" });
  }, [append]);

  const lastTutorMessage =
    [...messages].reverse().find((m) => m.role === "tutor" && !m.isTyping && m.text)?.text ?? "";

  return {
    messages,
    handleWhatsNext,
    handleSend,
    handleSummariseArticle,
    handleRaiseHand,
    handleSkip,
    lastTutorMessage,
  };

}

export type TutorConversation = ReturnType<typeof useTutorConversation>;