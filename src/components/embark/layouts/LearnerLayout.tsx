import { useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { PersonaLayout } from "../PersonaLayout";
import { GraduatingTopHeader } from "../GraduatingTopHeader";
import { learnerNav, learnerMobileTabs } from "../navConfig";
import { HelpDrawerProvider, useHelpDrawer } from "../HelpDrawerContext";
import { AskAIProvider, useAskAI } from "../AskAIContext";
import { helpRequests } from "@/data/mockData";

const STORAGE_KEY = "embark_learner_sidebar_collapsed";

function readInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function LearnerLayoutInner() {
  const { openDrawer } = useHelpDrawer();
  const { open: askAIOpen } = useAskAI();
  const { pathname } = useLocation();
  const isHome = pathname === "/learner/home";
  const openCount = helpRequests.filter((r) => r.learnerId === "l1" && r.status === "open").length;

  const [collapsed, setCollapsed] = useState<boolean>(readInitialCollapsed);
  const effectiveCollapsed = collapsed || askAIOpen;

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "true" : "false");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isGraduating =
    pathname === "/learner/graduating" || pathname.startsWith("/learner/graduating/");

  // Pages that already render their own logo bar (learner home + session shells)
  const ownsBrandBar =
    pathname === "/learner/home" ||
    pathname.startsWith("/learner/session/") ||
    pathname.startsWith("/learner/role-play/") ||
    pathname.startsWith("/learner/assessment/") ||
    pathname.startsWith("/learner/micro-learning/");

  const graduatingRouteMap: Record<string, string> = {
    Home: "/learner/graduating",
    "My History": "/learner/graduating/history",
    "Live Events": "/learner/graduating/events",
    "Hands Raised": "/learner/graduating/hands-raised",
  };

  const nav = useMemo(() => {
    if (isGraduating) {
      return learnerNav.map((item) => ({
        ...item,
        route: graduatingRouteMap[item.label] ?? item.route,
        ...(item.label === "Hands Raised"
          ? { badge: undefined, badgeVariant: undefined, onClick: undefined }
          : {}),
        ...(item.label === "Live Events" ? { badge: undefined } : {}),
      }));
    }

    return learnerNav.map((item) => {
      if (item.label === "Hands Raised") {
        return {
          ...item,
          route: "/learner/home?tab=hands_raised",
          badge: openCount > 0 ? openCount : undefined,
          badgeVariant: openCount > 0 ? ("danger" as const) : item.badgeVariant,
          onClick: undefined,
        };
      }
      if (item.label === "Home") {
        return { ...item, route: "/learner/home?tab=current" };
      }
      return item;
    });

  }, [isGraduating, openCount]);

  const mobileTabs = useMemo(() => {
    if (isGraduating) {
      return learnerMobileTabs.map((tab) => {
        if (tab.label === "Home") {
          return { ...tab, label: "Dashboard" as const, route: "/learner/graduating", onClick: undefined };
        }
        if (tab.label === "Sage") {
          return { ...tab, route: "/learner/graduating", onClick: undefined };
        }
        if (tab.label === "Hands Raised") {
          return { ...tab, route: "/learner/graduating/hands-raised", onClick: undefined };
        }
        return tab;
      });
    }
    return learnerMobileTabs.map((tab) =>
      tab.label === "Hands Raised"
        ? { ...tab, onClick: openCount > 0 ? openDrawer : undefined }
        : tab,
    );
  }, [isGraduating, openCount, openDrawer]);



  return (
    <PersonaLayout
      hideSidebar
      header={isGraduating ? <GraduatingTopHeader /> : undefined}
      hideBrandBar={ownsBrandBar}
      sageUserName={isGraduating ? "Alex Morgan" : undefined}
      sidebar={{
        persona: "learner",
        items: nav,
        hideNotifications: isHome,
        hideProfile: isHome,
        ...(isHome
          ? { collapsed: effectiveCollapsed, onToggleCollapsed: toggleCollapsed }
          : {}),
      }}
      mobileTabs={mobileTabs}
    />
  );
}

export default function LearnerLayout() {
  return (
    <HelpDrawerProvider>
      <AskAIProvider>
        <LearnerLayoutInner />
      </AskAIProvider>
    </HelpDrawerProvider>
  );
}
