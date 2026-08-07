import * as React from "react"

import { cn } from "@/lib/utils"

// Bottom-weighted edge, same idea as the liquid-refract rim
// (components/ui/glasscn/liquid-glass.tsx): a hairline that fades toward
// the corners, plus a soft bloom underneath, instead of a flat outline.
// Both layers read their color from --card-edge-color so the accent always
// tracks whatever ring/border color the variant (or a consumer override)
// sets — nothing here is hardcoded to a specific hue.
//
// To recolor from outside, override the CSS var via the `style` prop (inline
// style always wins over utility classes, unlike stacking another className):
//   <Card style={{ "--card-edge-color": "var(--primary)" } as React.CSSProperties} />
// --card-edge-line / --card-edge-glow tune the accent's opacity if needed.
const cardVariants = {
  default: [
    "bg-card ring-0.5 ring-(--card-edge-color)/10 [--card-edge-color:var(--foreground)]",
    "shadow-[inset_0_-1px_0_0_color-mix(in_oklab,var(--card-edge-color)_var(--card-edge-line,14%),transparent),inset_0_-16px_24px_-18px_color-mix(in_oklab,var(--card-edge-color)_var(--card-edge-glow,8%),transparent)]",
  ].join(" "),
  outline: [
    "bg-transparent border border-(--card-edge-color)/15 [--card-edge-color:var(--foreground)]",
    "shadow-[inset_0_-1px_0_0_color-mix(in_oklab,var(--card-edge-color)_var(--card-edge-line,20%),transparent),inset_0_-16px_24px_-18px_color-mix(in_oklab,var(--card-edge-color)_var(--card-edge-glow,10%),transparent)]",
  ].join(" "),
}

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  variant?: keyof typeof cardVariants
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
