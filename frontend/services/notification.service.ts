import { apiClient } from "./api";
import type {
  Notification,
  ApiResponse,
  PaginatedNotificationsResponse,
} from "@/types";

export async function getNotifications(): Promise<PaginatedNotificationsResponse> {
  const { data } = await apiClient.get<PaginatedNotificationsResponse>(
    "/jobs/notifications"
  );
  return data;
}

export async function getNotificationById(
  id: string
): Promise<Notification> {
  const { data } = await apiClient.get<ApiResponse<Notification>>(
    `/jobs/notifications/${id}`
  );
  return data.data;
}
