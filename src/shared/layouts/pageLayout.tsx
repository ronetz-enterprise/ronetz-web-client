import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Page() {
    return (
        <SidebarProvider className="">
            <AppSidebar className="border-none" />
            <SidebarInset className="bg-sidebar" >
                <header className="flex h-[45px]   shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">

                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />

                    </div>
                </header>
                <main className="m-1.5 sm:m-3 sm:mt-0  mt-0 bg-background border rounded-md overflow-y-auto  h-[calc(100vh-60px)]">
                    <Outlet />

                </main>

            </SidebarInset>
        </SidebarProvider>
    )
}
