import { Request, Response, NextFunction } from 'express';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import Mailjet from 'node-mailjet';
import { getFromCache, saveToCache } from '../config/redis';
import { AppError } from '../errors/AppError';
import { addMinutes } from 'date-fns';
import { templateToEmail } from '../utils/templateToEmail';

export class ResendVerificationCode {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;

    const responseCache = await getFromCache(`cacheKey:${userId}`);

    if (!responseCache) {
      throw new AppError(404, 'No user data found in cache.');
    }

    const result = JSON.parse(responseCache as string);
    const { name, email } = result;

    const code = generateVerificationCode();

    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC as string,
      process.env.MJ_APIKEY_PRIVATE as string
    );

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'elleylson.santtos.7@gmail.com',
            Name: 'Burguer Red',
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: 'Código de Verificação',
          TextPart:
            'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
          HTMLPart: templateToEmail(code),
        },
      ],
    });

    try {
      await request;

      result.code = code;
      result.expiresAt = addMinutes(new Date(), 1);

      await saveToCache(`cacheKey:${userId}`, JSON.stringify(result));

      next();
    } catch (error) {
      console.log('Erro no envio do email:', error);
      return { message: 'Erro ao enviar o email', error };
    }
  }
}
