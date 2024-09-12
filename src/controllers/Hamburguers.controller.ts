import { inject, injectable } from 'tsyringe';
import { HamburguersService } from '../services/Hamburguers.service';
import { Request, Response } from 'express';

@injectable()
export class HamburguersController {
  constructor(
    @inject('HamburguersService') private hamburguersService: HamburguersService
  ) {}

  public getAllHamburguers = async (req: Request, res: Response) => {
    const response = await this.hamburguersService.getAllHamburguers();

    return res.status(200).json(response);
  };

  public createHamburguer = async (req: Request, res: Response) => {
    const response = await this.hamburguersService.createHamburguer(req.body);

    return res.status(200).json(response);
  };
}
