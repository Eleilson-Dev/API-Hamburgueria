import { Request, Response, NextFunction } from 'express';
import Mailjet from 'node-mailjet';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { templateToEmail } from '../utils/templateToEmail';
import { AppError } from '../errors/AppError';

export class SendVerificationEmail {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    let role = 'regular';

    if (password.includes('+')) {
      const [cleanName, key] = password.split('+');

      if (key !== process.env.ADMIN_PASS_KEY) {
        return next(
          new AppError(400, 'Palavra-chave de administrador inválida.')
        );
      }

      role = 'admin';

      req.body.password = cleanName.trim();
    }

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

      res.locals.userResult = {
        name,
        email,
        password: req.body.password,
        role,
        code: code.toString(),
      };

      next();
    } catch (error) {
      console.log('Erro no envio do email:', error);
      return { message: 'Erro ao enviar o email', error };
    }
  }
}
