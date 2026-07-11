import express from "express";
import notificationsController from "./notifications.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, notificationsController.getNotifications);
router.get("/:notificationId", authMiddleware, notificationsController.getNotificationById);

export default router;