import { prisma } from "../../utils/prisma";

const getNotifications = async (clerkId: string) => {
  return prisma.notification.findMany({
    where: {
      user: {
        clerkId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getNotificationById = async (notificationId: string, clerkId: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      user: {
        clerkId,
      },
    },
  });

  if (!notification) {
    return null;
  }

  return prisma.notification.update({
    where: {
      id: notification.id,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

const notificationsService = {
  getNotifications,
  getNotificationById,
};

export default notificationsService;
