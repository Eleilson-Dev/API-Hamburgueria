import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class VerifyLoginUser {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!user) {
      throw new AppError(404, 'Email or password does not match');
    }

    if (req.body.password) {
      const compare = await bcrypt.compare(
        req.body.password,
        user.password as string
      );

      if (!compare) {
        throw new AppError(401, 'Email or password does not match');
      }
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.locals.userLoginResult = {
      user: user.id,
      accessToken,
    };

    next();
  }
}
