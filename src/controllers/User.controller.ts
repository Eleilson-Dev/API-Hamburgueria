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

  public makeRecover = async (req: Request, res: Response) => {
    const response = await this.userService.makeRecovery(
      res.locals.userRecoverResult
    );

    return res.status(200).json(response);
  };

  public confirmRecoveryCode = async (req: Request, res: Response) => {
    const response = await this.userService.confirmRecoveryCode(
      req.body.userId,
      req.body.userEmail,
      req.body.code
    );

    return res.status(200).json(response);
  };

  public resetPassword = async (req: Request, res: Response) => {
    const response = await this.userService.resetPassword(
      res.locals.encodedRecoveryToken.userEmail,
      req.body.password
    );

    return res.status(200).json({ message: 'senha atualizada' });
  };

  public loginWithGoogle = async (req: Request, res: Response) => {
    const response = await this.userService.loginWithGoogle(
      req.body.access_token
    );

    return res.status(200).json(response);
  };
}
