import * as React from "react"
import {
    Wifi,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/modules/auth/store/authStore"
import { navigationConfig } from "@/shared/config/navigation"
import { NavMain } from "./nav-main"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthStore()

    const teams = [
        {
            name: "Rik WiFi",
            logo: Wifi,
            plan: "Pro v4",
        }
    ]

    const userData = {
        name: user ? (user.firstName ?? user.email) : "Utilisateur",
        email: user?.email || "",
        avatar: "", // Placeholder or user avatar if available
    }


    const filterMain = navigationConfig
        .filter(item => user && item.roles.includes(user.role))
        .map((item, index) => ({
            title: item.title,
            url: item.href,
            icon: item.icon,
            isActive: index === 0,

        }))




    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filterMain} ></NavMain>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>

        </Sidebar>
    )
}
