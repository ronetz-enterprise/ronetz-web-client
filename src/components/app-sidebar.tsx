import * as React from "react"
import { Settings } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
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
        <Sidebar collapsible="icon" variant="floating" className=" "  {...props} >
            <SidebarContent className="">
                <NavMain items={filterMain}></NavMain>
            </SidebarContent>

            {/* Settings at the bottom of the sidebar. */}
            <SidebarFooter>
                <SidebarMenu className=" items-center justify-center flex flex-col gap-1 ">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Paramètres">
                            <NavLink to="/profile">
                                <Settings className="h-4 w-4" />
                                
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
