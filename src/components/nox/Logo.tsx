import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const scale = {
    sm: { nox: "text-lg", casino: "text-[0.5rem]" },
    md: { nox: "text-2xl", casino: "text-[0.6rem]" },
    lg: { nox: "text-4xl", casino: "text-[0.75rem]" },
  }[size];

  return (
    <span className={cn("inline-flex select-none flex-col leading-none", className)}>
      <span
        className={cn(
          "font-display font-extrabold tracking-tight text-foreground",
          scale.nox,
        )}
      >
        N<span className="text-primary">O</span>X
      </span>
      <span
        className={cn(
          "font-display font-semibold uppercase tracking-[0.42em] text-muted-foreground",
          scale.casino,
        )}
      >
        Casino
      </span>
    </span>
  );
}
