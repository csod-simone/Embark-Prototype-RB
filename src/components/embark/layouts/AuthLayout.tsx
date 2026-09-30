import { Outlet } from "react-router-dom";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { BrandBar } from "@/components/embark/BrandBar";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <BrandBar />
      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-10">
        <PageContainer as="div" className="max-w-[800px]">
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}