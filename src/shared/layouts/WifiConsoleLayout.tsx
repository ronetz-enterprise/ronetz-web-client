import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { AccountMenu } from "@/components/account-menu"
import { NotificationBell } from "@/modules/notifications/components/NotificationBell"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"
import { useWifiConsoleTheme } from "./useWifiConsoleTheme"

export default function WifiConsoleLayout() {
  useWifiConsoleTheme()
  return (
    <SidebarProvider className="wifi-console h-svh bg-background">
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card px-4 sm:px-7">
          <span className="text-xs text-muted-foreground">Console WiFi <span className="mx-2 text-border" aria-hidden>/</span> Administration</span>
          <div className="flex items-center gap-3"><NotificationBell /><AccountMenu /></div>
        </header>
        <main id="console-content" className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-6 sm:px-7 md:pb-8 lg:px-9" tabIndex={-1}>
          <div className="mx-auto w-full max-w-[1320px]"><Outlet /></div>
        </main>
      </SidebarInset>
      <MobileBottomBar />
    </SidebarProvider>
  )
}
