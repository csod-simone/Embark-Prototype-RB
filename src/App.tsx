import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { BrandProvider } from "@/hooks/use-brand";
import { CornerstoneIntegrationProvider } from "@/hooks/use-cornerstone-integration";
import { DailyRecapsProvider } from "@/hooks/use-daily-recaps";
import { AssessmentSettingsProvider } from "@/hooks/use-assessment-settings";
import { LinesOfBusinessProvider } from "@/hooks/use-lines-of-business";
import { AssessmentTypeDefaultsProvider } from "@/hooks/use-assessment-type-defaults";
import { WeightagesProvider } from "@/hooks/use-weightages";
import { BrandingProvider } from "@/hooks/use-branding";
import { CohortSettingsProvider } from "@/hooks/use-cohort-settings";
import { FeatureFlagsProvider } from "@/hooks/use-feature-flags";
import { LearnerPreferencesProvider } from "@/hooks/use-learner-preferences";
import { TrainerViewProvider } from "@/hooks/use-trainer-view";
import { RaiseHandOptionsProvider } from "@/hooks/use-raise-hand-options";
import NotFound from "./pages/NotFound.tsx";
import AIThinkingDemo from "./pages/dev/AIThinkingDemo.tsx";

import AuthLayout from "@/components/embark/layouts/AuthLayout";
import LearnerLayout from "@/components/embark/layouts/LearnerLayout";
import ManagerLayout from "@/components/embark/layouts/ManagerLayout";
import AdminLayout from "@/components/embark/layouts/AdminLayout";
import UpskillerLayout from "@/components/embark/layouts/UpskillerLayout";

import UpskillerIntro from "@/pages/embark/upskiller/Intro";
import UpskillerSignals from "@/pages/embark/upskiller/Signals";
import UpskillerGenerating from "@/pages/embark/upskiller/Generating";
import UpskillerDashboard from "@/pages/embark/upskiller/Dashboard";
import UpskillerSession from "@/pages/embark/upskiller/Session";
import UpskillerRolePlay from "@/pages/embark/upskiller/RolePlay";
import UpskillerHistory from "@/pages/embark/upskiller/History";
import UpskillerEvents from "@/pages/embark/upskiller/Events";
import UpskillerHandsRaised from "@/pages/embark/upskiller/HandsRaised";
import ReadinessLayout from "@/components/embark/layouts/ReadinessLayout";
import ReadinessIntro from "@/pages/embark/readiness/Intro";
import ReadinessSignals from "@/pages/embark/readiness/Signals";
import ReadinessGenerating from "@/pages/embark/readiness/Generating";
import ReadinessDashboard from "@/pages/embark/readiness/Dashboard";
import ReadinessActivity from "@/pages/embark/readiness/Activity";
import ReadinessSession from "@/pages/embark/readiness/Session";
import ReadinessRolePlay from "@/pages/embark/readiness/RolePlay";
import ReadinessAssessment from "@/pages/embark/readiness/Assessment";
import ReadinessAssessmentResults from "@/pages/embark/readiness/AssessmentResults";
import ReadinessHistory from "@/pages/embark/readiness/History";
import ReadinessEvents from "@/pages/embark/readiness/Events";
import ReadinessHandsRaised from "@/pages/embark/readiness/HandsRaised";

import Login, { isPrototypeSignedIn } from "@/pages/embark/auth/Login";
import FirstLogin from "@/pages/embark/auth/FirstLogin";
import Transparency from "@/pages/embark/auth/Transparency";
import RoleSelect from "@/pages/embark/auth/RoleSelect";
import BaselineAssessment from "@/pages/embark/auth/BaselineAssessment";

import LearnerHome from "@/pages/embark/learner/Home";
import LearnerJourney from "@/pages/embark/learner/Journey";
import LearnerSettings from "@/pages/embark/learner/Settings";
import LearnerSession from "@/pages/embark/learner/Session";
import LearnerArticleSession from "@/pages/embark/learner/ArticleSession";
import LearnerVideoSession from "@/pages/embark/learner/VideoSession";
import LearnerMod4ArticleSession from "@/pages/embark/learner/Mod4ArticleSession";
import LearnerRolePlay from "@/pages/embark/learner/RolePlay";
import LearnerAssessment from "@/pages/embark/learner/Assessment";
import LearnerAssessmentResults from "@/pages/embark/learner/AssessmentResults";
import LearnerPersonalizing from "@/pages/embark/learner/Personalizing";
import LearnerPathSummary from "@/pages/embark/learner/PathSummary";
import LearnerMicroLearning from "@/pages/embark/learner/MicroLearning";
import LearnerHelp from "@/pages/embark/learner/Help";
import LearnerHistory from "@/pages/embark/learner/History";
import LearnerGraduation from "@/pages/embark/learner/Graduation";
import LearnerEvents from "@/pages/embark/learner/Events";
import GraduatingHome from "@/pages/embark/learner/graduating/Home";
import GraduatingArticle from "@/pages/embark/learner/graduating/Article";
import GraduatingCeremony from "@/pages/embark/learner/graduating/Ceremony";
import GraduatingEvents from "@/pages/embark/learner/graduating/Events";
import GraduatingHandsRaised from "@/pages/embark/learner/graduating/HandsRaised";
import GraduatingHistory from "@/pages/embark/learner/graduating/History";


import ManagerCohort from "@/pages/embark/manager/Cohort";
import ManagerCohorts from "@/pages/embark/manager/Cohorts";
import ManagerOverview from "@/pages/embark/manager/Overview";
import ManagerApprovals from "@/pages/embark/manager/Approvals";
import ManagerLearner from "@/pages/embark/manager/Learner";
import ManagerLearnerAssessments from "@/pages/embark/manager/LearnerAssessments";
import ManagerLearnerHelp from "@/pages/embark/manager/LearnerHelp";
import ManagerLearnerActivity from "@/pages/embark/manager/LearnerActivity";
import ManagerDirectReports from "@/pages/embark/manager/DirectReports";
import ManagerAnalytics from "@/pages/embark/manager/Analytics";
import ManagerCoaching from "@/pages/embark/manager/Coaching";
import ManagerHandsRaised from "@/pages/embark/manager/HandsRaised";
import ManagerGraduationReview from "@/pages/embark/manager/GraduationReview";

import AdminCurricula from "@/pages/embark/admin/Curricula";
import AdminBuilderIngest from "@/pages/embark/admin/BuilderIngest";
import AdminBuilderGenerate from "@/pages/embark/admin/BuilderGenerate";
import AdminBuilderReview from "@/pages/embark/admin/BuilderReview";
import AdminBuilderRefine from "@/pages/embark/admin/BuilderRefine";
import AdminBuilderPublish from "@/pages/embark/admin/BuilderPublish";
import AdminCohorts from "@/pages/embark/admin/Cohorts";
import AdminLearnerProfile from "@/pages/embark/admin/LearnerProfile";
import AdminCohortEnrollment from "@/pages/embark/admin/cohorts/Enrollment";
import AdminAnalytics from "@/pages/embark/admin/Analytics";
import AdminConfig from "@/pages/embark/admin/config/ConfigIndex";
import AdminConfigSection from "@/pages/embark/admin/config/ConfigSectionPage";
import AdminContent from "@/pages/embark/admin/Content";
import AdminContentEditor from "@/pages/embark/admin/ContentEditor";
import RolePlayBlueprint from "@/pages/embark/admin/content/roleplay/RolePlayBlueprint";
import AdminEditAssessment from "@/pages/embark/admin/EditAssessment";
import AdminJourneys from "@/pages/embark/admin/Journeys";
import AdminJourneyCreate from "@/pages/embark/admin/JourneyCreate";
import AdminJourneyEdit from "@/pages/embark/admin/JourneyEdit";
import AdminJourneyDetail from "@/pages/embark/admin/JourneyDetail";

import { BusinessLeadersProvider } from "@/hooks/use-business-leaders";
import { EventRegistrationProvider } from "@/hooks/use-event-registration";
import { ExperienceContentProvider } from "@/hooks/use-experience-content";
import { CohortWelcomeProvider } from "@/hooks/use-cohort-welcome";
import { OrganisationProvider } from "@/hooks/use-organisation";
import { OrgTextSwap } from "@/components/embark/OrgTextSwap";

const queryClient = new QueryClient();

function PrototypeGate() {
  const [signedIn, setSignedIn] = useState(isPrototypeSignedIn);
  if (!signedIn) {
    return <Login onSuccess={() => setSignedIn(true)} />;
  }
  return (
    <Routes>
      <Route element={<AuthLayout />}>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/first-login" element={<FirstLogin />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/dev/ai-thinking" element={<AIThinkingDemo />} />
            <Route path="/upskiller/intro" element={<UpskillerIntro />} />
            <Route path="/upskiller/signals" element={<UpskillerSignals />} />
            <Route path="/readiness/intro" element={<ReadinessIntro />} />
            <Route path="/readiness/signals" element={<ReadinessSignals />} />
          </Route>

          <Route path="/baseline-assessment" element={<BaselineAssessment />} />

          <Route path="/upskiller" element={<UpskillerLayout />}>
            <Route path="generating" element={<UpskillerGenerating />} />
            <Route path="dashboard" element={<UpskillerDashboard />} />
            <Route path="session/:sessionId" element={<UpskillerSession />} />
            <Route path="roleplay" element={<UpskillerRolePlay />} />
            <Route path="history" element={<UpskillerHistory />} />
            <Route path="events" element={<UpskillerEvents />} />
            <Route path="hands-raised" element={<UpskillerHandsRaised />} />
          </Route>

          <Route path="/readiness" element={<ReadinessLayout />}>
            <Route path="generating" element={<ReadinessGenerating />} />
            <Route path="dashboard" element={<ReadinessDashboard />} />
            <Route path="activity/:activityId" element={<ReadinessActivity />} />
            <Route path="session/:activityId" element={<ReadinessSession />} />
            <Route path="roleplay" element={<ReadinessRolePlay />} />
            <Route path="assessment/:activityId" element={<ReadinessAssessment />} />
            <Route
              path="assessment/:activityId/results"
              element={<ReadinessAssessmentResults />}
            />
            <Route path="history" element={<ReadinessHistory />} />
            <Route path="events" element={<ReadinessEvents />} />
            <Route path="hands-raised" element={<ReadinessHandsRaised />} />
          </Route>


          <Route path="/learner" element={<LearnerLayout />}>

            <Route path="home" element={<LearnerHome />} />
            <Route path="journey" element={<LearnerJourney />} />
            <Route path="session/s-article" element={<LearnerArticleSession />} />
            <Route path="session/s-video" element={<LearnerVideoSession />} />
            <Route path="session/mod4-s1" element={<LearnerMod4ArticleSession />} />
            <Route path="session/:sessionId" element={<LearnerSession />} />
            <Route path="role-play/:sessionId" element={<LearnerRolePlay />} />
            <Route path="assessment/:moduleId" element={<LearnerAssessment />} />
            <Route path="assessment/:moduleId/results" element={<LearnerAssessmentResults />} />
            <Route path="personalizing" element={<LearnerPersonalizing />} />
            <Route path="path-summary" element={<LearnerPathSummary />} />
            <Route path="micro-learning/:itemId" element={<LearnerMicroLearning />} />
            <Route path="help" element={<LearnerHelp />} />
            <Route path="history" element={<LearnerHistory />} />
            <Route path="graduation" element={<LearnerGraduation />} />
            <Route path="events" element={<LearnerEvents />} />
            <Route path="settings" element={<LearnerSettings />} />
            <Route path="graduating" element={<GraduatingHome />} />
            <Route path="graduating/events" element={<GraduatingEvents />} />
            <Route path="graduating/hands-raised" element={<GraduatingHandsRaised />} />
            <Route path="graduating/history" element={<GraduatingHistory />} />
            <Route path="graduating/article/:articleId" element={<GraduatingArticle />} />
            <Route path="graduating/graduation" element={<GraduatingCeremony />} />

          </Route>

          <Route path="/manager" element={<ManagerLayout />}>
            <Route path="overview" element={<ManagerOverview />} />
            <Route path="cohorts" element={<ManagerCohorts />} />
            <Route path="cohorts/:cohortId" element={<ManagerCohort />} />
            <Route path="approvals" element={<ManagerApprovals />} />
            <Route path="learner/:learnerId" element={<ManagerLearner />} />
            <Route path="learner/:learnerId/assessments" element={<ManagerLearnerAssessments />} />
            <Route path="learner/:learnerId/help" element={<ManagerLearnerHelp />} />
            <Route path="learner/:learnerId/activity" element={<ManagerLearnerActivity />} />
            <Route path="direct-reports" element={<ManagerDirectReports />} />
            <Route path="analytics" element={<ManagerAnalytics />} />
            <Route path="coaching" element={<ManagerCoaching />} />
            <Route path="hands-raised" element={<ManagerHandsRaised />} />
            <Route path="graduation-review" element={<ManagerGraduationReview />} />
          </Route>

          <Route path="/trainer/*" element={<Navigate to="/manager/overview" replace />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="curricula" element={<AdminCurricula />} />
            <Route path="builder/:curriculumId/ingest" element={<AdminBuilderIngest />} />
            <Route path="builder/:curriculumId/generate" element={<AdminBuilderGenerate />} />
            <Route path="builder/:curriculumId/review" element={<Navigate to="../refine" replace />} />
            <Route path="builder/:curriculumId/refine" element={<AdminBuilderReview />} />
            <Route path="builder/:curriculumId/configure" element={<AdminBuilderRefine />} />
            <Route path="builder/:curriculumId/publish" element={<AdminBuilderPublish />} />
            <Route path="cohorts" element={<AdminCohorts />} />
            <Route path="cohorts/:cohortId/enrollment" element={<AdminCohortEnrollment />} />
            <Route path="learner/:learnerId" element={<AdminLearnerProfile />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="config/:section" element={<AdminConfigSection />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="content/roleplay/new" element={<RolePlayBlueprint entryMode="create" />} />
            <Route
              path="content/roleplay/new/ai"
              element={<Navigate to="/admin/content/roleplay/new" replace />}
            />
            <Route
              path="content/roleplay/new/form"
              element={<Navigate to="/admin/content/roleplay/new" replace />}
            />
            <Route
              path="content/roleplay/:contentId/edit"
              element={<RolePlayBlueprint entryMode="edit" />}
            />
            <Route path="content/:contentId/edit" element={<AdminContentEditor />} />
            <Route path="content/:contentId/assessment/edit" element={<AdminEditAssessment />} />
            <Route path="journeys" element={<AdminJourneys />} />
            <Route path="journeys/new" element={<AdminJourneyCreate />} />
            <Route path="journeys/:journeyId" element={<AdminJourneyDetail />} />
            <Route path="journeys/:journeyId/edit" element={<AdminJourneyEdit />} />
          </Route>

          <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <OrganisationProvider>
    <BrandProvider>
    <CornerstoneIntegrationProvider>
    <DailyRecapsProvider>
    <LearnerPreferencesProvider>
    <RaiseHandOptionsProvider>
    <AssessmentSettingsProvider>
    <LinesOfBusinessProvider>
    <AssessmentTypeDefaultsProvider>
    <WeightagesProvider>
    <BrandingProvider>
    <CohortSettingsProvider>
    <BusinessLeadersProvider>
    <EventRegistrationProvider>
    <ExperienceContentProvider>
    <CohortWelcomeProvider>
    <FeatureFlagsProvider>
    <TrainerViewProvider>
    <TooltipProvider>
      <OrgTextSwap />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PrototypeGate />
      </BrowserRouter>
    </TooltipProvider>
    </TrainerViewProvider>
    </FeatureFlagsProvider>
    </CohortWelcomeProvider>
    </ExperienceContentProvider>
    </EventRegistrationProvider>
    </BusinessLeadersProvider>
    </CohortSettingsProvider>
    </BrandingProvider>
    </WeightagesProvider>
    </AssessmentTypeDefaultsProvider>
    </LinesOfBusinessProvider>
    </AssessmentSettingsProvider>
    </RaiseHandOptionsProvider>
    </LearnerPreferencesProvider>
    </DailyRecapsProvider>
    </CornerstoneIntegrationProvider>
    </BrandProvider>
    </OrganisationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
