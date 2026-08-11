import api from "@/core/api/axiosConfig";
import type { NotificationDto, NotificationPreferenceDto } from "../types";

export const notificationApi = {
  list: async (status?: "unread", page = 0, size = 20): Promise<NotificationDto[]> => {
    const res = await api.get<NotificationDto[]>("/api/notifications", {
      params: { status, page, size },
    });
    return res.data;
  },

  unreadCount: async (): Promise<number> => {
    const res = await api.get<{ count: number }>("/api/notifications/unread-count");
    return res.data.count;
  },

  markRead: async (id: string): Promise<NotificationDto> => {
    const res = await api.patch<NotificationDto>(`/api/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: () => api.patch<void>("/api/notifications/read-all"),

  preferences: {
    list: async (): Promise<NotificationPreferenceDto[]> => {
      const res = await api.get<NotificationPreferenceDto[]>("/api/notification-preferences");
      return res.data;
    },
    update: async (eventType: string, channels: string[]): Promise<NotificationPreferenceDto> => {
      const res = await api.put<NotificationPreferenceDto>(
        `/api/notification-preferences/${eventType}`,
        { channels }
      );
      return res.data;
    },
  },
};
