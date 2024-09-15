import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { UserService } from '../services/User.service';

@injectable()
export class UserController {
  constructor(@inject('UserService') private userService: UserService) {}

  public findAllUsers = async (req: Request, res: Response) => {
    const response = await this.userService.findAllUsers();
    return res.status(200).json(response);
  };

  public createUser = async (req: Request, res: Response) => {
    const reponse = await this.userService.createUser(req.body);

    return res.status(200).json(reponse);
  };

  public loginUser = async (req: Request, res: Response) => {
    const response = await this.userService.loginUser(
      res.locals.userLoginResult
    );

    return res.status(200).json(response);
  };
}
