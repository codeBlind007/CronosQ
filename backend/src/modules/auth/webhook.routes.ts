import express from 'express';
import {clerkWebhookHandler} from './webhook.controller';
const router = express.Router();

router.post('/clerk', clerkWebhookHandler);

export default router;