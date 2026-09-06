import * as React from "react"
import { Building2, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useAuthStore } from "@/modules/auth/store/authStore"
import { navigationConfig } from "@/shared/config/navigation"
import { NavMain } from "./nav-main"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const items = navigationConfig.filter((item) => user && item.roles.includes(user.role)).map((item) => ({
    title: item.title, url: item.href, icon: item.icon,
  }))
  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <div className="mx-3 mt-3 hidden rounded-xl border border-sidebar-border bg-white/[.035] p-3 group-data-[collapsible=icon]:hidden md:block">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.14em] text-sidebar-foreground/45">Espace actif</p>
        <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground">
          <Building2 className="h-3.5 w-3.5 text-sidebar-primary" />
          Mon domaine Wi-Fi
        </div>
      </div>
      <SidebarContent className="px-2 pt-3"><NavMain items={items} /></SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Paramètres">
              <NavLink to="/profile"><Settings /><span>Paramètres</span></NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem><SidebarCollapseButton /></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
function SidebarCollapseButton() {
  const { toggleSidebar, state } = useSidebar()
  const collapsed = state === "collapsed"
  return (
    <SidebarMenuButton tooltip={collapsed ? "Étendre la navigation" : "Réduire la navigation"} onClick={toggleSidebar}>
      {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      <span>{collapsed ? "Étendre" : "Réduire"}</span>
    </SidebarMenuButton>
  )
}