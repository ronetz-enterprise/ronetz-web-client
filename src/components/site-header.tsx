import { AccountMenu } from "@/components/account-menu"
import { NotificationBell } from "@/modules/notifications/components/NotificationBell"
import icon from "@/assets/icon.svg"

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-background-0 px-4 text-background-0-foreground sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
          <img src={icon} alt="" className="h-6 w-6" />
        </div>
        <div className="leading-none">
          <span className="block text-[17px] font-semibold tracking-[-0.03em]">Ronet</span>
          <span className="mt-1 hidden text-[10px] font-medium tracking-[0.16em] text-white/45 sm:block">NETWORK CONTROL</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="mr-2 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-lime)]" />
          Services opérationnels
        </span>
        <NotificationBell />
        <AccountMenu />
      </div>
    </header>
  )
}