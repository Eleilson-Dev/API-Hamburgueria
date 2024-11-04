import { Request, Response, NextFunction } from 'express';
import Mailjet from 'node-mailjet';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { templateToEmailForRecover } from '../utils/templateToEmailForRecover';

export class SendVerificationToRecoverPass {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

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
            },
          ],
          Subject: 'Código de Recuperação',
          TextPart:
            'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
          HTMLPart: templateToEmailForRecover(code),
        },
      ],
    });

    try {
      await request;

      res.locals.userRecoverResult = {
        email,
        code: code.toString(),
      };

      next();
    } catch (error) {
      console.log('Erro no envio do email:', error);
      return { message: 'Erro ao enviar o email', error };
    }
  }
}
