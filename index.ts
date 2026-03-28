import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './src/data-source';
import helmet from 'helmet';
import staysRouter from './src/routes/staysRouter';
import authRouter from './src/routes/authRouter';
import taskRouter from './src/routes/taskRouter';

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 3000;
    const myVariable = process.env.MYVARIABLE || 'default';

    app.use(cors());
    app.use(express.json());
    app.use(helmet());

    app.use('/api/v1/stays', staysRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/tasks', taskRouter);

    app.get('/', (req, res) => {
      res.send('Hello World! from E, myVar: ' + myVariable);
    });

    app.listen(port, () => {
      console.log(`App is running... (port: ${port})`);
    });
  })
  .catch((error) => {
    console.log(`Error while DB connection:`);
    console.log(error);
  });
