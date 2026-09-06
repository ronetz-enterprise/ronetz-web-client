import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function PageLayout() {
  return (
    <SidebarProvider className="h-svh flex-col bg-background-0">
      <SiteHeader />
      <div className="relative flex min-h-0 flex-1 [transform:translateZ(0)]">
        <AppSidebar className="h-full border-none" />
        <SidebarInset className="min-h-0 bg-background-0">
          <main className="relative m-1 min-h-0 flex-1 overflow-y-auto rounded-[22px] border border-border/80 bg-background sm:m-2 sm:rounded-[26px]">
            <div aria-hidden className="ronet-grid pointer-events-none absolute inset-x-0 top-0 h-48 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-9">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
      <MobileBottomBar />
    </SidebarProvider>
  )
}