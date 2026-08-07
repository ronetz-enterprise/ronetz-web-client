import type { LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/shared/lib/utils"

interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: LucideIcon
}

/** An Input with a leading icon instead of a text label above it. */
export function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input  className={cn("pl-9 h-11 rounded-xl", className)} {...props} />
    </div>
  )
}
