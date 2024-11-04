import { NextFunction, Request, Response } from 'express';
import { getFromCache } from '../config/redis';
import { AppError } from '../errors/AppError';

export class ValidateCacheAndExpiration {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;

    const responseCache = await getFromCache(`cacheKey:${userId}`);

    if (!responseCache) {
      throw new AppError(410, 'TIME_EXPIRED');
    }

    const result = JSON.parse(responseCache as string);

    const expiresAt = new Date(result.expiresAt);
    const currentTime = new Date();

    if (currentTime.getTime() > expiresAt.getTime()) {
      throw new AppError(400, 'CODE_EXPIRED');
    }

    next();
  }
}
