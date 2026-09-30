import { useCallback, useEffect, useState } from "react";

export type RecipientOption = "learner" | "learner_manager";

export const RECIPIENT_OPTIONS: {
  value: RecipientOption;
  label: string;
  description: string;
}[] = [
  {
    value: "learner",
    label: "Learner only",
    description: "The graduation email is sent to the learner only.",
  },
  {
    value: "learner_manager",
    label: "Learner and line manager",
    description: "The graduation email is sent to the learner and their line manager.",
  },
];

export type OutcomeKey = "approve" | "softLanding" | "flag";

export type GraduationEmailSettings = {
  approve: { subject: string; body: string };
  softLanding: { subject: string; body: string };
  flag: { subject: string; body: string };
  recipients: RecipientOption;
  active: boolean;
};

export const DEFAULT_GRADUATION_EMAIL: GraduationEmailSettings = {
  approve: {
    subject: "Congratulations — your graduation has been approved!",
    body: `Dear [Learner Name],

We're delighted to confirm that your line manager has reviewed and approved your graduation.

This email serves as your official completion certificate. Please retain it for your records.

You're ready for the next stage — congratulations on this fantastic achievement!`,
  },
  softLanding: {
    subject: "Well done — your line manager has reviewed your graduation",
    body: `Dear [Learner Name],

Your line manager has reviewed your graduation and has recommended a short period of supervised practice before your final sign-off.

This is a positive step — it gives you the opportunity to build further confidence in a supported environment before fully graduating.

Your line manager will be in touch with next steps. Keep up the great work!`,
  },
  flag: {
    subject: "Your line manager has reviewed your graduation",
    body: `Dear [Learner Name],

Your line manager has reviewed your graduation and has identified some additional practice areas to help you build further confidence before graduating.

This is to make sure you feel fully prepared — your line manager will be in touch to outline the recommended next steps.

Keep going — you're making great progress!`,
  },
  recipients: "learner_manager",
  active: true,
};

const STORAGE_KEY = "embark:notification-settings";

export function useNotificationSettings() {
  const [graduationEmail, setGraduationEmail] = useState<GraduationEmailSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_GRADUATION_EMAIL;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_GRADUATION_EMAIL;
      const parsed = JSON.parse(raw) as Partial<GraduationEmailSettings> & { recipients?: string };
      const recipients =
        parsed.recipients === "learner" || parsed.recipients === "learner_manager"
          ? parsed.recipients
          : DEFAULT_GRADUATION_EMAIL.recipients;
      return { ...DEFAULT_GRADUATION_EMAIL, ...parsed, recipients };
    } catch {
      return DEFAULT_GRADUATION_EMAIL;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graduationEmail));
    } catch {
      // ignore
    }
  }, [graduationEmail]);

  const saveGraduationEmail = useCallback((next: GraduationEmailSettings) => {
    setGraduationEmail(next);
  }, []);

  return { graduationEmail, saveGraduationEmail };
}

export function recipientLabel(value: RecipientOption) {
  return RECIPIENT_OPTIONS.find((o) => o.value === value)?.label ?? "";
}
