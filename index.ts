import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './src/data-source';
import { Task } from './src/entities/Task';
import { Stay } from './src/entities/Stay';
import { authenticateToken } from './src/middleware/authenticateToken';
import bcrypt from 'bcryptjs';
import { User } from './src/entities/User';
import { generateToken } from './src/helper/tokenHelper';
import jwt from 'jsonwebtoken';

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 3000;
    const myVariable = process.env.MYVARIABLE || 'default';
    const registerActive = process.env.REGISTER_ACTIVE || true;

    app.use(cors());
    app.use(express.json());
    // app.use(authenticateToken);

    app.get('/', (req, res) => {
      res.send('Hello World! from E, myVar: ' + myVariable);
    });
    if (registerActive) {
      app.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(422);
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.create({
          name,
          email,
          password: hashedPassword,
        });
        const saved = await userRepo.save(user);

        const token = generateToken(saved);
        res.status(201).json({ message: 'User registered', token });
      });
    }

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) return res.status(422);
      const userRepo = AppDataSource.getRepository(User);
      const existintUser = await userRepo.findOneBy({ email: email });

      if (
        existintUser &&
        (await bcrypt.compare(password, existintUser.password))
      ) {
        const token = generateToken(existintUser);
        return res.json({ token, message: 'successfully logged in' });
      }
      res.status(400).json({ message: 'Invalid credentials' });
    });

    // Routes
    app.post('/stays', authenticateToken, async (req, res) => {
      const stayRepo = AppDataSource.getRepository(Stay);
      const stay = await stayRepo.create(req.body as Stay);
      const saved = await stayRepo.save(stay);
      // Templates zu Tasks kopieren (Standard-Listen)
      const defaultTasks = [
        { title: 'Milch', category: 'shopping' as const },
        { title: 'Klopapier', category: 'shopping' as const },
        { title: 'Bettwäsche gewaschen', category: 'departure' as const },
        { title: 'Fenster zu', category: 'departure' as const },
      ];
      for (const t of defaultTasks) {
        const task = AppDataSource.getRepository(Task).create({
          ...t,
          stay: saved,
        });
        await AppDataSource.getRepository(Task).save(task);
      }
      res.json(saved);
    });

    app.get('/stays/:id/tasks', authenticateToken, async (req, res) => {
      console.log('🚀 ~ req:', req.user);
      const tasks = await AppDataSource.getRepository(Task).find({
        where: { stay: { id: req.params.id } },
        relations: { stay: true },
      });
      if (tasks.length === 0) res.status(404);
      res.json(tasks);
    });

    app.put('/tasks/:id', async (req, res) => {
      const task = await AppDataSource.getRepository(Task).findOneBy({
        id: req.params.id,
      });
      if (!task) return res.status(404);
      AppDataSource.getRepository(Task).merge(task!, req.body);
      const updated = await AppDataSource.getRepository(Task).save(task!);
      res.json(updated);
    });

    app.listen(port, () => {
      console.log(`App is running... (port: ${port})`);
    });
  })
  .catch((error) => {
    console.log(`Error while DB connection:`);
    console.log(error);
  });
