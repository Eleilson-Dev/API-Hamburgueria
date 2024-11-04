import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { SodaService } from '../services/Soda.service';

@injectable()
export class SodaController {
  constructor(
    @inject('SodaService')
    private refrigerantesService: SodaService
  ) {}

  async getAllSodas(req: Request, res: Response) {
    const refrigerantes = await this.refrigerantesService.getAllSodas();
    res.json(refrigerantes);
  }

  async getSodaById(req: Request, res: Response) {
    const { id } = req.params;
    const refrigerante = await this.refrigerantesService.getSodaById(
      Number(id)
    );
    res.json(refrigerante);
  }

  async createSoda(req: Request, res: Response) {
    const newRefrigerante = await this.refrigerantesService.createSoda(
      req.body,
      req.file
    );
    res.status(201).json(newRefrigerante);
  }

  async editSoda(req: Request, res: Response) {
    const { id } = req.params;

    await this.refrigerantesService.editSoda(Number(id), req.body, req.file);

    return res.status(204).json();
  }

  public changeVisibility = async (req: Request, res: Response) => {
    await this.refrigerantesService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public async deleteSoda(req: Request, res: Response) {
    await this.refrigerantesService.deleteSoda(Number(req.params.id));

    return res.status(204).send();
  }
}
