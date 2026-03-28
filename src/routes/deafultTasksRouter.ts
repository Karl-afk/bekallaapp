import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { AppDataSource } from '../data-source';
import { DefaultTask } from '../entities/DefaultTasks';

const defaultTasksRouter = Router();

defaultTasksRouter.use(authenticateToken);

defaultTasksRouter.post('/', async (req, res) => {
  const { title, category } = req.body;

  if (!title || !category) return res.status(422);

  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);

  const createdTask = defaultTaskRepo.create({
    title: title,
    category: category,
    isDone: false,
  });

  return res.json({
    message: 'successfully created default task',
    defaultTask: createdTask,
  });
});

defaultTasksRouter.get('/', async (req, res) => {
  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);

  const defaultTasks = defaultTaskRepo.find();

  return res.json({ defaultTasks });
});

defaultTasksRouter.delete('/:id', async (req, res) => {
  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);

  const defaultTask = defaultTaskRepo.findOneBy({ id: req.params.id });

  if (!defaultTask) return res.status(404);

  return res.status(204);
});

export default defaultTasksRouter;
