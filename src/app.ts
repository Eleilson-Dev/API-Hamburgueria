import 'express-async-errors';
import 'reflect-metadata';

import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { hamburguerRouter } from './routes/hamburguer.routes';
import { sodaRouter } from './routes/soda.routes';
import { userRouter } from './routes/user.routes';
import { orderRouter } from './routes/order.routes';
import { HandleErrors } from './middlewares/HandleErrors.middleware';
import { pizzaRouter } from './routes/pizza.routes';
import { categoryRouter } from './routes/categories.routes';
import { savoryRouter } from './routes/savory.routes';
import { juiceRouter } from './routes/juice.routes';
import { cakeRouter } from './routes/cake.routes';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(json());

app.use('/categories', categoryRouter);
app.use('/users', userRouter);
app.use('/hamburguers', hamburguerRouter);
app.use('/salgados', savoryRouter);
app.use('/pizzas', pizzaRouter);
app.use('/bolos', cakeRouter);
app.use('/refrigerantes', sodaRouter);
app.use('/sucos', juiceRouter);
app.use('/orders', orderRouter);

app.use(HandleErrors.execute);
