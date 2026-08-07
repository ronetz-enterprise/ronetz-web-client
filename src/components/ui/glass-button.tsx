import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot as SlotPrimitive } from "radix-ui"

const glassButtonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl cursor-pointer",
    "text-sm font-medium transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:scale-101 active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-white/20 backdrop-blur-xl border border-white/30 text-white",
          "shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
        ),
        primary: cn(
          // Emerald glass, derived from the app's own --primary (not a
          // generic Tailwind swatch) — lighter mint at the top-left fading
          // to a deeper shade at the bottom-right, echoing login_hero.png.
          "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_65%,white)_0%,var(--primary)_50%,color-mix(in_srgb,var(--primary)_75%,black)_100%)]",
          "backdrop-blur-xl border border-white/30 text-white",
          //"shadow-[0_4px_10px_rgba(65,154,62,0.4)]",
          "hover:shadow-[0_2px_5px_rgba(65,154,62,0.6)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/30 before:to-transparent before:pointer-events-none",
        ),
        outline: cn(
          "bg-transparent backdrop-blur-sm border-2 border-white/40 text-white",
        ),
        ghost: cn("bg-transparent text-white/70"),
        destructive: cn(
          "bg-red-500/30 backdrop-blur-xl border border-red-400/40 text-red-100",
          "shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
        ),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  glowEffect?: boolean,
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, asChild = false, size, glowEffect = false, children, ...props }, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : "button"
    return (
      <div className="relative inline-block">
        {glowEffect && (
          <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 blur-lg opacity-70 transition-opacity group-hover:opacity-100" />
        )}
        <Comp className={cn(glassButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </Comp>
      </div>
    )
  },
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
