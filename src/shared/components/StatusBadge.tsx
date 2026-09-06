import { cn } from "@/shared/lib/utils"
export type StatusBadgeTone = "success" | "warning" | "danger" | "neutral"
const toneStyles: Record<StatusBadgeTone, string> = {
  success: "border-primary/20 bg-primary/8 text-primary",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-muted-foreground",
}
export function StatusBadge({ tone, children, className }: { tone: StatusBadgeTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold", toneStyles[tone], className)}>
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{children}
    </span>
  )
}