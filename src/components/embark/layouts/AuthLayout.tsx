import { Outlet, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { BrandBar } from "@/components/embark/BrandBar";
import { cn } from "@/lib/utils";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const canvas = pathname === "/first-login" || pathname === "/transparency";

  return (
    <div className={cn("min-h-screen w-full flex flex-col", canvas ? "bg-[#f4f5f8]" : "bg-background")}>
      <BrandBar />
      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-10">
        <PageContainer as="div">
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}