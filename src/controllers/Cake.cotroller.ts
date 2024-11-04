import { Request, Response } from 'express';
import { CakeService } from '../services/Cake.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CakeController {
  constructor(@inject('CakeService') private cakeService: CakeService) {}

  public getAllCakes = async (req: Request, res: Response) => {
    const reponse = await this.cakeService.getAllCakes();

    return res.status(200).json(reponse);
  };

  public getCakeById = async (req: Request, res: Response) => {
    const response = await this.cakeService.getCakeById(Number(req.params.id));

    return res.status(200).json(response);
  };

  public createCake = async (req: Request, res: Response) => {
    const response = await this.cakeService.createCake(req.body, req.file);

    return res.status(200).json(response);
  };

  public changeVisibility = async (req: Request, res: Response) => {
    await this.cakeService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public updateCake = async (req: Request, res: Response) => {
    await this.cakeService.updateCake(
      Number(req.params.id),
      req.body,
      req.file
    );

    return res.status(200).json();
  };

  public deleteCake = async (req: Request, res: Response) => {
    await this.cakeService.deleteCake(Number(req.params.id));

    return res.status(200).json();
  };
}
