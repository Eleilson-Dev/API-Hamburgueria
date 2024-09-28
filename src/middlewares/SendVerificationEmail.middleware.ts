import { Request, Response, NextFunction } from 'express';
import Mailjet from 'node-mailjet';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { templateToEmail } from '../utils/templateToEmail';

export class SendVerificationEmail {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
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
            Name: 'Hamburgueria BV',
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

      res.locals.userResult = { name, email, password, code: code.toString() };

      next();
    } catch (error) {
      console.log('Erro no envio do email:', error);
      return { message: 'Erro ao enviar o email', error };
    }
  }
}
