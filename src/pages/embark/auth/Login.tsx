import { PlaceholderScreen } from "@/components/embark/PlaceholderScreen";
import { BrandLogo } from "@/components/embark/BrandLogo";

export default function Login() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-center">
        <BrandLogo className="h-9" />
      </div>
      <PlaceholderScreen name="Sign in" />
    </div>
  );
}
