import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CategoryService } from '../services/Category.service';

@injectable()
export class CategoryController {
  constructor(
    @inject('CategoryService') private categoryService: CategoryService
  ) {}

  public getAllCategories = async (req: Request, res: Response) => {
    const response = await this.categoryService.getAllCategories();

    return res.status(200).json(response);
  };
}
