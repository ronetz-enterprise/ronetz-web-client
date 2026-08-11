import { AccountMenu } from "@/components/account-menu"
import { NotificationBell } from "@/modules/notifications/components/NotificationBell"
import icon from "@/assets/icon.svg"
/** Full-width bar above the sidebar+content row — see pageLayout.tsx.
 *  On mobile the sidebar toggle lives in MobileBottomBar instead, so this
 *  header stays the same on every breakpoint. */
export function SiteHeader() {
    return (
        <header className="flex h-[48px] shrink-0 items-center justify-between bg-background-0 text-background-0-foreground px-4">
            <div className="flex items-end  gap-2">
                <img src={icon} alt="" className="h-6" />

                <span className="font-bold text-[20px] leading-none ">Ronetz</span>
            </div>

            <div className="flex items-center gap-1">
                <NotificationBell />
                <AccountMenu />
            </div>
        </header>
    )
}
