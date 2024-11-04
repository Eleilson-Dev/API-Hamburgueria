import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { JuiceService } from '../services/Juice.service';

@injectable()
export class JuiceController {
  constructor(@inject('JuiceService') private juiceService: JuiceService) {}

  public getAllJuices = async (req: Request, res: Response) => {
    const response = await this.juiceService.getAllJuices();

    return res.status(200).json(response);
  };

  public async getJuiceById(req: Request, res: Response) {
    const { id } = req.params;

    const refrigerante = await this.juiceService.getJuiceById(Number(id));
    res.json(refrigerante);
  }

  public async createJuice(req: Request, res: Response) {
    const newRefrigerante = await this.juiceService.createJuice(
      req.body,
      req.file
    );

    res.status(201).json(newRefrigerante);
  }

  public async editJuice(req: Request, res: Response) {
    const { id } = req.params;

    const updatedRefrigerante = await this.juiceService.editJuice(
      Number(id),
      req.body,
      req.file
    );

    res.json(updatedRefrigerante);
  }

  public changeVisibility = async (req: Request, res: Response) => {
    await this.juiceService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public async deleteJuice(req: Request, res: Response) {
    await this.juiceService.deleteJuice(Number(req.params.id));

    return res.status(204).send();
  }
}
