import { NextFunction, Request, Response } from 'express';

export class IsImgValid {
  static async execute(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    if (
      req.file.mimetype !== 'image/png' &&
      req.file.mimetype !== 'image/jpeg'
    ) {
      return res.status(400).json({
        error: 'Formato de arquivo inválido. Apenas PNG e JPEG são aceitos.',
      });
    }

    if (req.file.size === 0) {
      return res
        .status(400)
        .json({ error: 'Arquivo vazio. Por favor, envie um arquivo válido.' });
    }

    next();
  }
}
