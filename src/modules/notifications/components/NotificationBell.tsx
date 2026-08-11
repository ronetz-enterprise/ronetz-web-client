import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
  useUnreadCount,
} from "../hooks/useNotifications";
import { useNotificationSocket } from "../hooks/useNotificationSocket";
import type { NotificationDto } from "../types";

function severityDotClass(severity: NotificationDto["severity"]) {
  switch (severity) {
    case "CRITIQUE":
      return "bg-destructive";
    case "IMPORTANT":
      return "bg-amber-500";
    default:
      return "bg-muted-foreground";
  }
}

/** Cloche in-app + live push WebSocket — voir useNotificationSocket pour la connexion temps réel. */
export function NotificationBell() {
  useNotificationSocket();

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifications = [], isLoading } = useNotificationList("unread");
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading && (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">Chargement…</div>
        )}
        {!isLoading && notifications.length === 0 && (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Aucune nouvelle notification
          </div>
        )}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={cn("flex flex-col items-start gap-0.5 whitespace-normal py-2")}
              onClick={() => markRead.mutate(n.id)}
            >
              <div className="flex w-full items-center gap-2">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", severityDotClass(n.severity))} />
                <span className="text-sm font-medium">{n.title}</span>
              </div>
              <span className="pl-3.5 text-xs text-muted-foreground">{n.message}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
