import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './src/data-source';
import helmet from 'helmet';
import staysRouter from './src/routes/staysRouter';
import authRouter from './src/routes/authRouter';
import taskRouter from './src/routes/taskRouter';
import defaultTasksRouter from './src/routes/deafultTasksRouter';
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middleware/errorHandler';
import { HttpException } from './src/types/HttpException';
import { notificationRouter } from './src/routes/notifications';
import { startScheduler } from './src/services/scheduler.service';
import { reminderRouter } from './src/routes/reminderRouter';

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 3000;
    const myVariable = process.env.MYVARIABLE || 'default';
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

    app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true, // ← Cookies erlauben!
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      }),
    );
    app.use(express.json());
    app.use(helmet());
    app.use(cookieParser());

    app.use('/api/v1/stays', staysRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/tasks', taskRouter);
    app.use('/api/v1/default-tasks', defaultTasksRouter);
    app.use('/api/v1/notify', notificationRouter);
    app.use('/api/v1/reminders', reminderRouter);

    app.get('/', (req, res) => {
      throw new HttpException(500, 'Test error handling', 'Test Error');
      res.send('Hello World! from E, myVar: ' + myVariable);
    });

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`App is running... (port: ${port})`);
      startScheduler();
    });
  })
  .catch((error) => {
    console.log(`Error while DB connection:`);
    console.log(error);
  });
