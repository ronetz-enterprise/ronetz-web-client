import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Page() {
    return (
        // SidebarProvider must wrap everything that calls useSidebar() —
        // SiteHeader's SidebarTrigger included. Its own wrapper div is a
        // row by default (`flex`); `flex-col` here stacks [header, row]
        // instead, so the header spans full width above the sidebar+content
        // row rather than sitting beside it as a third column.
        <SidebarProvider className="h-svh flex-col">
            <SiteHeader />
            {/* The sidebar's actual rail is `position:fixed; inset-y-0;
                h-svh` (see ui/sidebar.tsx's "sidebar-container") — pinned to
                the real viewport no matter where it sits in the DOM, which
                is why reordering JSX alone couldn't put it "below" the
                header. `[transform:translateZ(0)]` gives this div its own
                containing block, so `fixed` descendants position relative
                to IT instead of the viewport; `h-full` on AppSidebar
                (below) then makes the rail fill exactly that box instead of
                assuming 100svh. */}
            <div className="relative bg-background-0 flex min-h-0 flex-1 [transform:translateZ(0)] mb-1">
                <AppSidebar className="h-full border-none pr-0.25 " />
                <SidebarInset className="min-h-0 bg-background-0">
                    <main className="min-h-0 flex-1 my-1 mx-0 m-1.5 bg-background border overflow-y-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
            {/* Mobile-only: replaces the sidebar with a floating icon pill
                (toggle + search) — see MobileBottomBar and Sidebar's mobile branch. */}
            <MobileBottomBar />
        </SidebarProvider>
    )
}
