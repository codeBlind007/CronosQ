import { Router } from "express";

import {validate} from "../../middleware/validate.middleware"
import { authMiddleware } from "../../middleware/auth.middleware";
import { createJobSchema } from "./jobs.validation";
import jobsController from "./jobs.controller";

const router = Router();

router.post("/", authMiddleware, validate(createJobSchema), jobsController.createJob);

export default router;