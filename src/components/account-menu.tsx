import {
    BadgeCheck,
    Bell,
    CreditCard,
    LogOut,
    Moon,
    Sparkles,
    Sun,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useAuthStore } from "@/modules/auth/store/authStore"

/** Header-level account menu — the sidebar equivalent (nav-user.tsx) was retired once this moved out. */
export function AccountMenu() {
    const { user, logout } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"
    const navigate = useNavigate()

    const name = user ? (user.firstName ?? user.email) : "Utilisateur"
    const email = user?.email ?? ""
    const initials = name.slice(0, 2).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Compte"
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="" alt={name} />
                        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{name}</span>
                            <span className="truncate text-xs text-muted-foreground">{email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
                    {isDark ? <Sun /> : <Moon />}
                    {isDark ? "Thème clair" : "Thème sombre"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
