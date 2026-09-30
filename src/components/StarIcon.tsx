import { cn } from "@/lib/utils";

type StarIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const StarIcon = ({ size = 20, className, ...props }: StarIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    className={cn("text-primary", className)}
    {...props}
  >
    <path d="M12 1.5c.4 4.6 2 7.7 4.4 9.3 1.6 1.1 3.7 1.7 6.1 2-4.6.4-7.7 2-9.3 4.4-1.1 1.6-1.7 3.7-2 6.1-.4-4.6-2-7.7-4.4-9.3-1.6-1.1-3.7-1.7-6.1-2 4.6-.4 7.7-2 9.3-4.4 1.1-1.6 1.7-3.7 2-6.1z" />
  </svg>
);

export default StarIcon;