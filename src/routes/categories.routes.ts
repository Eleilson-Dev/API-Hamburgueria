import { Router } from 'express';
import { container } from 'tsyringe';
import { CategoryService } from '../services/Category.service';
import { CategoryController } from '../controllers/Category.controller';

export const categoryRouter = Router();

container.registerSingleton('CategoryService', CategoryService);
const categoryController = container.resolve(CategoryController);

categoryRouter.get('/', (req, res) =>
  categoryController.getAllCategories(req, res)
);
