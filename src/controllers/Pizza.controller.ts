import { Request, Response } from 'express';
import { PizzaService } from '../services/Pizza.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PizzaController {
  constructor(@inject('PizzaService') private pizzaService: PizzaService) {}

  public getAllPizzas = async (req: Request, res: Response) => {
    const response = await this.pizzaService.getAllPizzas();

    return res.status(200).json(response);
  };

  public getPizzaById = async (req: Request, res: Response) => {
    const response = await this.pizzaService.getPizzaById(
      Number(req.params.id)
    );

    return res.status(200).json(response);
  };

  public createPizza = async (req: Request, res: Response) => {
    const response = await this.pizzaService.createPizza(req.body, req.file);

    return res.status(200).json(response);
  };

  public editPizza = async (req: Request, res: Response) => {
    await this.pizzaService.editPizza(
      Number(req.params.id),
      req.body,
      req.file
    );

    return res.status(204).json();
  };

  public changeVisibility = async (req: Request, res: Response) => {
    await this.pizzaService.changeVisibility(
      Number(req.params.id),
      req.body.visibility
    );

    return res.status(204).json();
  };

  public deletePizza = async (req: Request, res: Response) => {
    await this.pizzaService.deletePizza(Number(req.params.id));

    return res.status(204).json();
  };
}
