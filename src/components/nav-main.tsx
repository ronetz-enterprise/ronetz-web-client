import { type LucideIcon } from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
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
        <SidebarGroup className="p-0">
          
            <SidebarMenu className= " p-0 bg-white py-3 rounded-3xl border items-center justify-center flex flex-col gap-1">
                {items.map((item) => (

                    <SidebarMenuItem key={item.url} >

                        <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title} asChild>

                            <NavLink
                                to={item.url}

                            >
                                <item.icon className="w-4 h-4" />
                                
                            </NavLink>

                        </SidebarMenuButton>





                    </SidebarMenuItem>

                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
