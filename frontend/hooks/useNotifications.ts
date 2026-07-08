"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getNotificationById,
} from "@/services/notification.service";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  list: () => ["notifications", "list"] as const,
  detail: (id: string) => ["notifications", "detail", id] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: getNotifications,
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.data?.filter((n) => !n.isRead).length ?? 0;
}

export function useNotificationById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: NOTIFICATION_KEYS.detail(id),
    queryFn: async () => {
      const notification = await getNotificationById(id);
      // Optimistically update the list cache
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      return notification;
    },
    enabled: !!id,
  });
}
