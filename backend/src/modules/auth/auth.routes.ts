import express from "express";
import authController from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const router = express.Router();

router.get("/profile", authMiddleware, authController.getUserProfile);

export default router;