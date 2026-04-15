
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { NavLink, useLocation } from "react-router-dom"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean

    }[]
}) {
    const { pathname } = useLocation()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (

                    <SidebarMenuItem >

                        <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title} asChild>

                            <NavLink
                                to={item.url}

                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                            </NavLink>

                        </SidebarMenuButton>





                    </SidebarMenuItem>

                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
