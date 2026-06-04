import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  /*
    Default Error
  */
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /*
    Prisma Errors
  */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate field value";
        break;

      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;

      default:
        statusCode = 400;
        message = "Database error";
    }
  }

  /*
    Zod Validation Errors
  */
  if (err instanceof ZodError) {
    statusCode = 400;

    message = err.issues.map((e) => e.message).join(", ");
  }

  /*
    JWT / Clerk / Auth errors
  */
  if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};