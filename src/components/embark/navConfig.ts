import type { LucideIcon } from "lucide-react";
import {
  managerApprovalsPendingCount,
  managerCohortsAttentionCount,
  managerGraduationReviewCount,
  managerHandsRaisedCount,
  trainerEventsCount,
  trainerHandsRaisedCount,
} from "@/data/tabCounts";
import {
  House, Map, Clock, Calendar, Hand, GraduationCap,
  Users, BarChart3, Sparkles, ClipboardCheck,
  BookOpen, Users2, Settings, FolderOpen,
} from "lucide-react";


export type SubNavItem = {
  label: string;
  route: string;
  dot?: "success" | "muted";
  footer?: boolean;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  route: string;
  badge?: number | string;
  badgeVariant?: "default" | "danger";
  disabled?: boolean;
  disabledReason?: string;
  infoTooltip?: string;
  onClick?: () => void;
  children?: SubNavItem[];
};


export const learnerNav: NavItem[] = [
  { label: "Home", icon: House, route: "/learner/home" },
];

export const managerNav: NavItem[] = [
  { label: "My Overview", icon: House, route: "/manager/overview" },
  {
    label: "My Cohorts",
    icon: Users,
    route: "/manager/cohorts",
    badge: managerCohortsAttentionCount,
    badgeVariant: "danger",
    children: [
      { label: "Medicare CSR Cohort A", route: "/manager/cohorts/cohort-a", dot: "success" },
      { label: "Medicare CSR Cohort B", route: "/manager/cohorts/cohort-b", dot: "success" },
      { label: "New Starter Cohort Q3", route: "/manager/cohorts/cohort-q3", dot: "muted" },
      { label: "View all cohorts", route: "/manager/cohorts", footer: true },
    ],
  },
  { label: "Approval Requests", icon: ClipboardCheck, route: "/manager/approvals", badge: managerApprovalsPendingCount },
  { label: "Hands Raised", icon: Hand, route: "/manager/hands-raised", badge: managerHandsRaisedCount, badgeVariant: "danger" },
  { label: "Graduation Review", icon: GraduationCap, route: "/manager/graduation-review", badge: managerGraduationReviewCount },
  { label: "Analytics", icon: BarChart3, route: "/manager/analytics" },
];


export const trainerNav: NavItem[] = [
  { label: "Home", icon: House, route: "/trainer/home" },
  { label: "Hands Raised", icon: Hand, route: "/trainer/hands-raised", badge: trainerHandsRaisedCount, badgeVariant: "danger" },
  { label: "Analytics", icon: BarChart3, route: "/trainer/analytics" },
  { label: "My Events", icon: Calendar, route: "/trainer/events", badge: trainerEventsCount },
];


export const adminNav: NavItem[] = [
  { label: "Cohorts", icon: Users2, route: "/admin/cohorts" },
  { label: "Journeys", icon: Map, route: "/admin/journeys" },
  { label: "Paths", icon: BookOpen, route: "/admin/curricula" },
  { label: "Content", icon: FolderOpen, route: "/admin/content" },
  { label: "Analytics", icon: BarChart3, route: "/admin/analytics" },
  { label: "Configuration", icon: Settings, route: "/admin/config" },
];

export type MobileTab = { label: string; icon: LucideIcon; route: string; onClick?: () => void };

export const learnerMobileTabs: MobileTab[] = [
  { label: "Home", icon: House, route: "/learner/home" },
  { label: "Hands Raised", icon: Hand, route: "/learner/help" },
  { label: "Sage", icon: Sparkles, route: "/learner/home" },
];

export const managerMobileTabs: MobileTab[] = [
  { label: "Cohort", icon: Users, route: "/manager/cohorts" },
  { label: "Help", icon: Hand, route: "/manager/cohorts" },
  { label: "Approvals", icon: Sparkles, route: "/manager/coaching" },
];

export const trainerMobileTabs: MobileTab[] = [
  { label: "Home", icon: House, route: "/trainer/home" },
  { label: "Events", icon: Calendar, route: "/trainer/events" },
];


export const adminMobileTabs: MobileTab[] = [
  { label: "Paths", icon: BookOpen, route: "/admin/curricula" },
  { label: "Cohorts", icon: Users2, route: "/admin/cohorts" },
  { label: "Config", icon: Settings, route: "/admin/config" },
];

export const upskillerNav: NavItem[] = [
  { label: "Home", icon: House, route: "/upskiller/dashboard" },
  { label: "My History", icon: Clock, route: "/upskiller/dashboard" },
  { label: "Live Events", icon: Calendar, route: "/upskiller/dashboard" },
  { label: "Hands Raised", icon: Hand, route: "/upskiller/dashboard" },
];

export const upskillerMobileTabs: MobileTab[] = [
  { label: "Home", icon: House, route: "/upskiller/dashboard" },
  { label: "Sage", icon: Sparkles, route: "/upskiller/dashboard" },
];
export const readinessNav: NavItem[] = [
  { label: "Home", icon: House, route: "/readiness/dashboard" },
  { label: "My History", icon: Clock, route: "/readiness/history" },
  { label: "Live Events", icon: Calendar, route: "/readiness/events" },
  { label: "Hands Raised", icon: Hand, route: "/readiness/hands-raised" },
];

export const readinessMobileTabs: MobileTab[] = [
  { label: "Home", icon: House, route: "/readiness/dashboard" },
  { label: "Sage", icon: Sparkles, route: "/readiness/dashboard" },
];
