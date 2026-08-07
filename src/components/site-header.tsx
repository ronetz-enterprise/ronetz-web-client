import { Bell, Wifi } from "lucide-react"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

/** Full-width bar above the sidebar+content row — see pageLayout.tsx. */
export function SiteHeader() {
    return (
        <header className="flex h-[48px] shrink-0 items-center justify-between bg-background-0 text-background-0-foreground px-4">
            <div className="flex items-center gap-2">
                {/* Sidebar starts as a hidden mobile Sheet — this is its only way open there. */}
                <SidebarTrigger className="md:hidden" />
                <Wifi className="h-5 w-5 text-primary" />
                <span className="font-bold">Ronetz</span>
            </div>

            <div className="flex items-center gap-1">
                {/* Placeholder: no notification backend yet. */}
                <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                </Button>
                <AccountMenu />
            </div>
        </header>
    )
}
