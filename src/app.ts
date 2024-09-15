import 'express-async-errors';
import 'reflect-metadata';
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { lanchesRouter } from './routes/lanches.routes';
import { userRouter } from './routes/user.routes';
import { orderRouter } from './routes/order.routes';
import { HandleErrors } from './middlewares/HandleErrors.middleware';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(json());

app.use('/users', userRouter);
app.use('/lanches', lanchesRouter);
app.use('/orders', orderRouter);
app.use(HandleErrors.execute);
