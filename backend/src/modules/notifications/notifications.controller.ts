import { NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import notificationsService from "./notifications.services";


const getNotifications: RequestHandler = async (req, res, next: NextFunction) => {
  try {
      const { clerkId } = req as AuthenticatedRequest;
      console.log("controller: getNotifications", clerkId);
      
    const notifications = await notificationsService.getNotifications(clerkId);

    if (notifications.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No notifications found",
      });
    }

    return res.status(200).json({
      success: true,
      results: notifications.length,
      data: notifications,
    });

  }catch (error) {
    next(error);
  }
}

const getNotificationById: RequestHandler = async (req, res, next: NextFunction) => {
  try{
    const {clerkId} = req as AuthenticatedRequest;
    const notificationId = Array.isArray(req.params.notificationId)
      ? req.params.notificationId[0]
      : req.params.notificationId;

    if(!notificationId){
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await notificationsService.getNotificationById(notificationId, clerkId);

    if(!notification){
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    })

  }catch(error) {
    next(error);
  }
}

const notificationsController = {
  getNotifications,
  getNotificationById,
};

export default notificationsController;
