
import { LucideProps } from "lucide-react";

export function AdIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7h18" />
      <path d="M7 15h2" />
      <path d="M15 15h2" />
      <path d="M7 11h10" />
    </svg>
  );
}
