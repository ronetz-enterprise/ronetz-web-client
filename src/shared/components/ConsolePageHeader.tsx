import type { ReactNode } from "react"

export function ConsolePageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}</header>
}
