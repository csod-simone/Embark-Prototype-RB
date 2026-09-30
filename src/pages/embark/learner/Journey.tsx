import { GlobalHeader } from "@/components/embark/GlobalHeader";
import { JourneyTabContent } from "./home/JourneyTabs";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function Journey() {
  return (
    <>
      <GlobalHeader title="My Journey" />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageContainer as="div">
          <JourneyTabContent activeTab="journey" />
        </PageContainer>
      </div>
    </>
  );
}
