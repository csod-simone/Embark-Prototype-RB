import { DemoUserSwitcher } from "@/components/embark/DemoUserSwitcher";
import { BrandLogo } from "@/components/embark/BrandLogo";

export function BrandBar({ right }: { right?: React.ReactNode } = {}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b border-border bg-card flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <a href="/" aria-label="Rathbones home" className="inline-flex items-center">
          <BrandLogo />
        </a>
        <DemoUserSwitcher variant="inline" />
      </div>
      {right}
    </header>
  );
}