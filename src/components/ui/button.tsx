import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  { variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(10_23_17/.12)] hover:bg-primary/90",
      outline: "border-border bg-card text-foreground hover:border-primary/30 hover:bg-accent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/75",
      ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
      destructive: "bg-destructive/10 text-destructive hover:bg-destructive/16",
      link: "rounded-none px-0 text-primary underline-offset-4 hover:underline",
      "default-glass": "border-white/15 bg-white/10 text-white hover:bg-white/15",
      "primary-glass": "bg-primary text-primary-foreground hover:bg-primary/90",
      "secondary-glass": "border-white/15 bg-white/8 text-white hover:bg-white/14",
      "outline-glass": "border-white/25 bg-transparent text-white hover:bg-white/8",
      "ghost-glass": "bg-transparent text-white/70 hover:bg-white/8 hover:text-white",
      "destructive-glass": "border-red-300/20 bg-red-400/10 text-red-100 hover:bg-red-400/20",
    },
    size: {
      default: "h-10 px-4", xs: "h-8 rounded-lg px-2.5 text-xs", sm: "h-9 rounded-[10px] px-3 text-[13px]",
      lg: "h-11 px-5", icon: "size-10", "icon-xs": "size-8 rounded-lg", "icon-sm": "size-9 rounded-[10px]", "icon-lg": "size-11",
    },
  }, defaultVariants: { variant: "default", size: "default" } }
)
function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
export { Button, buttonVariants }