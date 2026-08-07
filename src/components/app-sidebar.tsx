import * as React from "react"
import { PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/modules/auth/store/authStore"
import { navigationConfig } from "@/shared/config/navigation"
import { NavMain } from "./nav-main"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthStore()

    const filterMain = navigationConfig
        .filter(item => user && item.roles.includes(user.role))
        .map((item, index) => ({
            title: item.title,
            url: item.href,
            icon: item.icon,
            isActive: index === 0,
        }))

    return (
        <Sidebar collapsible="icon" variant="floating"  {...props}>
            <SidebarContent className="">
                <NavMain items={filterMain}></NavMain>
            </SidebarContent>

            {/* Bottom of the sidebar: settings, then the collapse/expand
                toggle right below it, per the requested layout. */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Paramètres">
                            <NavLink to="/profile">
                                <Settings className="h-4 w-4" />
                                <span>Paramètres</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarCollapseButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

function SidebarCollapseButton() {
    const { toggleSidebar, state } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <SidebarMenuButton
            tooltip={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
            onClick={toggleSidebar}
        >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            <span>{collapsed ? "Étendre" : "Réduire"}</span>
        </SidebarMenuButton>
    )
}
