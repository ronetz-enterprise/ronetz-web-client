import { type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NavLink, useLocation } from "react-router-dom"

export function NavMain({ items }: { items: { title: string; url: string; icon: LucideIcon }[] }) {
  const { pathname } = useLocation()
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-sidebar-foreground/40">Navigation</SidebarGroupLabel>
      <SidebarMenu className="mt-1 gap-1">
        {items.map((item) => {
          const active = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url + "/"))
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton isActive={active} tooltip={item.title} asChild className="h-10 rounded-xl px-3 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary">
                <NavLink to={item.url}>
                  <item.icon className="h-4 w-4" /><span>{item.title}</span>
                  {active && <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}