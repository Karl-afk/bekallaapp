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

  const savedTask = await defaultTaskRepo.save(createdTask);

  return res.json({
    message: 'successfully created default task',
    defaultTask: savedTask,
  });
});

defaultTasksRouter.put('/:id', async (req, res) => {
  const { title, category } = req.body;

  if (!title && !category)
    return res.status(200).json({ message: 'nothing to update' });

  if (category && category !== 'shopping' && category !== 'departure')
    return res.status(422).json({ message: 'invalid category' });
  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);
  const updateData: Partial<DefaultTask> = {};
  if (title) updateData.title = title;
  if (category) updateData.category = category;

  const result = await defaultTaskRepo.update(
    { id: req.params.id },
    updateData,
  );
  if (result.affected === 0) {
    return res.status(404).json({ message: 'DefaultTask not found' });
  }

  return res.json({
    message: 'successfully updated default task',
  });
});

defaultTasksRouter.get('/', async (req, res) => {
  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);

  const defaultTasks = await defaultTaskRepo.find();

  return res.json({ defaultTasks });
});

defaultTasksRouter.delete('/:id', async (req, res) => {
  const defaultTaskRepo = AppDataSource.getRepository(DefaultTask);

  const defaultTask = await defaultTaskRepo.findOneBy({ id: req.params.id });

  if (!defaultTask) return res.status(404);

  await defaultTaskRepo.remove(defaultTask);

  return res.status(204);
});

export default defaultTasksRouter;
