import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export class ValidateBody {
  static execute(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ errors: error.issues });
        }
        next(error);
      }
    };
  }
}
