import React from "react";
import { ClaimStatus } from "@/lib/types";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ClaimBadgeProps {
  status: ClaimStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ClaimBadge: React.FC<ClaimBadgeProps> = ({
  status,
  size = "md",
  showLabel = true,
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (status === "GREEN") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 ${sizeClasses[size]}`}
      >
        <CheckCircle2 className={`${iconSizes[size]} text-emerald-400 shrink-0`} />
        {showLabel && <span>Supported by Research</span>}
      </span>
    );
  }

  if (status === "YELLOW") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 ${sizeClasses[size]}`}
      >
        <AlertTriangle className={`${iconSizes[size]} text-amber-400 shrink-0`} />
        {showLabel && <span>Needs Verification</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 ${sizeClasses[size]}`}
    >
      <XCircle className={`${iconSizes[size]} text-rose-400 shrink-0`} />
      {showLabel && <span>Unsupported Claim</span>}
    </span>
  );
};
