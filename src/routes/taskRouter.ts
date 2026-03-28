import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { authenticateToken } from '../middleware/authenticateToken';

const taskRouter = Router();

taskRouter.use(authenticateToken);

taskRouter.put('/:id', async (req, res) => {
  const task = await AppDataSource.getRepository(Task).findOneBy({
    id: req.params.id,
  });
  if (!task) return res.status(404);
  AppDataSource.getRepository(Task).merge(task!, req.body);
  const updated = await AppDataSource.getRepository(Task).save(task!);
  res.json(updated);
});

export default taskRouter;
