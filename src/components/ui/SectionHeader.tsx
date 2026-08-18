import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeader({
  index,
  label,
  children,
  className,
}: {
  index: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-header", className)}>
      <div className="eyebrow"><span>{index}</span><span>/</span><span>{label}</span></div>
      <h2 className="section-title">{children}</h2>
    </div>
  );
}
