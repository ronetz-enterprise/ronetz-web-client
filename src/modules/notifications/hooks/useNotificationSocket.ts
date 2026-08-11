import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authApi } from "@/modules/auth/api/authApi";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { notificationQueryKeys } from "./useNotifications";
import type { NotificationDto } from "../types";

const WS_ENDPOINT = `${import.meta.env.VITE_API_URL}/ws`;

/**
 * Live push côté client pour NOTIFICATION_MODULE.md §9.2 : SockJS + STOMP vers
 * platform-app/WebSocketConfig, destination `/user/queue/notifications`
 * (WebSocketChannelAdapter côté backend). L'authentification se fait sur la trame STOMP
 * CONNECT (header `Authorization`, lu par StompAuthChannelInterceptor) — pas sur le
 * handshake HTTP lui-même, un WebSocket natif ne permettant pas de header personnalisé.
 *
 * Volontairement best-effort : si la connexion est indisponible ou tombe, `useUnreadCount`
 * (polling 60s) et le rechargement de la liste à l'ouverture du dropdown restent la source
 * de vérité — voir la note du doc "l'envoi est silencieusement sans effet, c'est accepté".
 */
export function useNotificationSocket() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT) as unknown as WebSocket,
      reconnectDelay: 5000,
      // Résolu à chaque (re)connexion plutôt qu'une fois à la construction : le token
      // Firebase expire après 1h, une reconnexion après coupure doit en repasser un frais.
      beforeConnect: async () => {
        const token = await authApi.getAccessToken();
        client.connectHeaders = { Authorization: `Bearer ${token ?? ""}` };
      },
      onConnect: () => {
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body) as NotificationDto;
          queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
          queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list("unread") });
          toast(notification.title, { description: notification.message });
        });
      },
      // Silencieux par design (cf. Javadoc) — pas de bruit console en prod sur une simple coupure.
      onStompError: () => {},
      onWebSocketError: () => {},
    });

    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [isAuthenticated, queryClient]);
}
