import { inject, injectable } from 'tsyringe';
import { SavoryService } from '../services/Savory.service';
import { Request, Response } from 'express';

@injectable()
export class SavoryController {
  constructor(@inject('SavoryService') private savoryService: SavoryService) {}

  public getAllSavorys = async (req: Request, res: Response) => {
    const response = await this.savoryService.getAllSavorys();

    return res.status(200).json(response);
  };

  public getSavoryById = async (req: Request, res: Response) => {
    const response = await this.savoryService.getSavoryById(
      Number(req.params.id)
    );

    return res.status(200).json(response);
  };

  public createSavory = async (req: Request, res: Response) => {
    const response = await this.savoryService.createSavory(req.body, req.file);

    return res.status(200).json(response);
  };

  public changeVisibility = async (req: Request, res: Response) => {
    await this.savoryService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public editSavory = async (req: Request, res: Response) => {
    await this.savoryService.editSavory(
      Number(req.params.id),
      req.body,
      req.file
    );

    return res.status(204).json();
  };

  public deleteSavory = async (req: Request, res: Response) => {
    await this.savoryService.deleteSavory(Number(req.params.id));

    return res.status(204).json();
  };
}
