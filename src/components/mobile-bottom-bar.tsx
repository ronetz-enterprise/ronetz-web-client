import { PanelTopIcon, Search, XIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

// Kept in sync with SIDEBAR_MOBILE_BOTTOMBAR_OFFSET in ui/sidebar.tsx —
// that's how much space the mobile sidebar panel leaves above this bar.
export const MOBILE_BOTTOMBAR_GAP = "1rem"

/**
 * Mobile-only stand-in for the sidebar (see PageLayout): a small floating,
 * icon-only pill hovering above the bottom of the screen — nav toggle and
 * search. Tapping the toggle opens the full nav as a near-full-height
 * top-down panel (Sidebar's mobile branch in ui/sidebar.tsx) whose bottom
 * edge lands mid-pill, visually cutting it in two. The pill sits in a
 * higher stacking layer than the panel (z-[60] > the panel's z-50) so it
 * stays fully rendered and clickable on top of it — the same toggle button
 * now acting as a close control.
 */
export function MobileBottomBar() {
    const { openMobile, setOpenMobile } = useSidebar()

    return (
        <div
            className="fixed inset-x-0 z-[60] flex justify-center md:hidden"
            style={{ bottom: `calc(${MOBILE_BOTTOMBAR_GAP} + env(safe-area-inset-bottom))` }}
        >
            <div className="flex items-center gap-1 rounded-full border bg-background/95 p-1.5 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
                <button
                    type="button"
                    aria-label={openMobile ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={openMobile}
                    onClick={() => setOpenMobile(!openMobile)}
                    className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent",
                        openMobile && "bg-accent"
                    )}
                >
                    {openMobile ? (
                        <XIcon className="h-5 w-5" />
                    ) : (
                        <PanelTopIcon className="h-5 w-5" />
                    )}
                </button>

                <button
                    type="button"
                    aria-label="Rechercher"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
                >
                    <Search className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
