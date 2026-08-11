// Domain model for the Notifications bounded context (mirrors backend bc-notifications DTOs
// — NotificationResponse / NotificationPreferenceResponse, see NOTIFICATION_MODULE.md §9.5).

export type NotificationSeverity = "INFO" | "IMPORTANT" | "CRITIQUE";

/** Same shape whether it arrives via GET /api/notifications or pushed over the WebSocket. */
export interface NotificationDto {
  id: string; // UUID
  eventType: string;
  severity: NotificationSeverity;
  title: string;
  message: string;
  locale: string;
  payload: Record<string, unknown>;
  createdAt: string; // Instant (ISO string)
  readAt: string | null;
}

export interface NotificationPreferenceDto {
  eventType: string;
  /** ex. ["EMAIL", "IN_APP"] — IN_APP toujours présent (forcé côté serveur, INV-2). */
  channels: string[];
}
