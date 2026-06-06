import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from "@clerk/express";
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import forwardToApp from './utils/ngrok';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
  origin: CLIENT_URL,
}))

app.use(clerkMiddleware());
app.use(express.json());

forwardToApp();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use('/api/v1/auth', authRoutes);
app.use(errorMiddleware);

export default app;