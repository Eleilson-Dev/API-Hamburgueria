import { inject, injectable } from 'tsyringe';
import { HamburguerService } from '../services/Hamburguer.service';
import { Request, Response } from 'express';

@injectable()
export class HamburguerController {
  constructor(
    @inject('HamburguerService') private hamburguersService: HamburguerService
  ) {}

  public getAllHamburguers = async (req: Request, res: Response) => {
    const response = await this.hamburguersService.getAllHamburguers();

    return res.status(200).json(response);
  };

  public getHamburguerById = async (req: Request, res: Response) => {
    const response = await this.hamburguersService.getHamburguerById(
      Number(req.params.id)
    );

    return res.status(200).json(response);
  };

  public createHamburguer = async (req: Request, res: Response) => {
    const response = await this.hamburguersService.createHamburguer(
      req.body,
      req.file
    );

    return res.status(200).json(response);
  };

  public editHamburguer = async (req: Request, res: Response) => {
    await this.hamburguersService.editHamburguer(
      Number(req.params.id),
      req.body,
      req.file
    );

    return res.status(204).json();
  };

  public changeVisibility = async (req: Request, res: Response) => {
    await this.hamburguersService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public deleteHamburguer = async (req: Request, res: Response) => {
    await this.hamburguersService.deleteHamburguer(Number(req.params.id));

    return res.status(204).json();
  };
}
