import { AccountMenu } from "@/components/account-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationBell } from "@/modules/notifications/components/NotificationBell"
import icon from "@/assets/icon.svg"
/** Full-width bar above the sidebar+content row — see pageLayout.tsx. */
export function SiteHeader() {
    return (
        <header className="flex h-[48px] shrink-0 items-center justify-between bg-background-0 text-background-0-foreground px-4">
            <div className="flex items-end  gap-2">
                {/* Sidebar starts as a hidden mobile Sheet — this is its only way open there. */}
                <SidebarTrigger className="md:hidden" />
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
