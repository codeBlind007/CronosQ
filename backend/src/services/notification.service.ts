import { prisma } from "../utils/prisma";
import { NotificationEventType } from "../generated/prisma/enums";

interface CreateNotificationInput {
  userId: string;
  jobId?: string;
  title: string;
  message: string;
  type: NotificationEventType;
  metadata?: Record<string, any>;
}

const createNotification = async ({
  userId,
  jobId,
  title,
  message,
  type,
  metadata,
}: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      userId,
      jobId: jobId ?? null,
      title,
      message,
      type,
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
};

const notificationService = {
  createNotification,
};

export default notificationService;
