import 'express-async-errors';
import 'reflect-metadata';
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { lanchesRouter } from './routes/lanches.routes';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(json());

app.use('/lanches', lanchesRouter);
