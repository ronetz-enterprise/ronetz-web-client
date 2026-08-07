import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LiquidGlass } from "./glasscn/liquid-glass"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        // Glass counterparts — same semantic roles as the variants above,
        // dressed for sitting on a photo/gradient backdrop (e.g. the auth
        // hero) rather than a flat app background. These render transparent
        // here on purpose: Button() below wraps them in the real LiquidGlass
        // component (components/ui/glasscn/liquid-glass.tsx), which supplies
        // the actual refraction + rim highlight. The tint/border that used
        // to live on these classes now lives in glassLiquidTint, applied to
        // that wrapper instead. Text stays white so it reads over imagery
        // regardless of app theme.
        "default-glass": "border-0 bg-transparent text-white shadow-none",
        "primary-glass": "border-0 bg-transparent text-white shadow-none",
        "secondary-glass": "border-0 bg-transparent text-white shadow-none",
        "outline-glass": "border-0 bg-transparent text-white shadow-none",
        "ghost-glass": "border-0 bg-transparent text-white/70 shadow-none hover:text-white",
        "destructive-glass": "border-0 bg-transparent text-red-100 shadow-none",
      },
      size: {
        default:
          "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.9rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-10",
        "icon-xs":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

// Per-variant tint + border for the LiquidGlass wrapper. This is where the
// "color modification" story for glass buttons now lives — swap a value
// here (or derive it from a theme token, as primary/secondary/destructive
// already do via var(--primary) etc.) and every button using that variant
// follows.
const glassLiquidTint: Partial<Record<ButtonVariant, string>> = {
  "default-glass": "border border-white/30 bg-white/20",
  "primary-glass": cn(
    "border border-white/30",
    // Same primary-derived gradient as the standalone glass-button: lighter
    // mint top-left fading to a deeper shade bottom-right.
    "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_65%,white)_0%,var(--primary)_50%,color-mix(in_srgb,var(--primary)_75%,black)_100%)]",
  ),
  "secondary-glass": "border border-white/25 bg-[color-mix(in_srgb,var(--secondary)_55%,transparent)]",
  "outline-glass": "border border-white/40 bg-transparent",
  "ghost-glass": "border border-transparent bg-white/[0.04]",
  "destructive-glass": "border border-red-400/40 bg-[color-mix(in_srgb,var(--destructive)_35%,transparent)]",
}

// LiquidGlass measures its own border-radius to build the refraction map, so
// the wrapper's rounding has to track the size variant's rounding — these
// mirror the radius fragments in the `size` variants above; keep them in
// sync if those change.
const glassWrapperRadiusBySize: Record<ButtonSize, string> = {
  default: "rounded-lg",
  lg: "rounded-lg",
  icon: "rounded-lg",
  "icon-lg": "rounded-lg",
  xs: "rounded-lg",
  sm: "rounded-lg",
  "icon-xs": "rounded-lg",
  "icon-sm": "rounded-lg",
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const liquidTint = variant ? glassLiquidTint[variant] : undefined

  if (liquidTint) {
    return (
      <LiquidGlass className={cn("w-fit", glassWrapperRadiusBySize[size ?? "default"], liquidTint)}>
        <ButtonPrimitive
          data-slot="button"
          data-glass-variant="liquid-refract"
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        />
      </LiquidGlass>
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
