import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData = await schema.parseAsync(req.body);

      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.flatten(),
        });
      }

      next(error);
    }
  };