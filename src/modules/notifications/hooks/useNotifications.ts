import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";
import { useAuthStore } from "@/modules/auth/store/authStore";

export const notificationQueryKeys = {
  unreadCount: ["notifications", "unread-count"] as const,
  list: (status?: "unread") => ["notifications", "list", status ?? "all"] as const,
};

/** Filet de secours par polling si le WebSocket est down — voir useNotificationSocket. */
export function useUnreadCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: notificationApi.unreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });
}

export function useNotificationList(status?: "unread") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: notificationQueryKeys.list(status),
    queryFn: () => notificationApi.list(status),
    enabled: isAuthenticated,
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: invalidate,
  });
}
