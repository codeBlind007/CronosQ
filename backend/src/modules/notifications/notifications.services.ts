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
    const notification = await prisma.notification.update({
        where: {
            id: notificationId,
            user: {
                clerkId,
            },
        },
        data: {
            isRead: true,
        },
    });
    return notification;
};


const notificationsService = {
  getNotifications,
  getNotificationById,
};

export default notificationsService;