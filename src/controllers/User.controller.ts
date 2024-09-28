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

  public findById = async (req: Request, res: Response) => {
    const response = await this.userService.findById(
      res.locals.encodedToken.id
    );

    return res.status(200).json(response);
  };

  public validateUser = async (req: Request, res: Response) => {
    const reponse = await this.userService.validateUser(res.locals.userResult);

    return res.status(200).json(reponse);
  };

  public createUser = async (req: Request, res: Response) => {
    const reponse = await this.userService.createUser(
      req.body.userId,
      req.body.code
    );

    return res.status(200).json(reponse);
  };

  public resendVerificationCode = async (req: Request, res: Response) => {
    const response = await this.userService.resendVerificationCode();

    return res.status(200).json(response);
  };

  public loginUser = async (req: Request, res: Response) => {
    const response = await this.userService.loginUser(
      res.locals.userLoginResult
    );

    return res.status(200).json(response);
  };
}
