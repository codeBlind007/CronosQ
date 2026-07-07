import { Router } from "express";

import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { createJobSchema } from "./jobs.validation";
import jobsController from "./jobs.controller";

const router = Router();

router.get("/notifications", authMiddleware, jobsController.getNotifications);
router
  .post(
    "/",
    authMiddleware,
    validate(createJobSchema),
    jobsController.createJob,
  )
  .get("/", authMiddleware, jobsController.getJobs);

router.get("/:jobId", authMiddleware, jobsController.getJobById);

export default router;
