import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { authenticateToken } from '../middleware/authenticateToken';
import { Stay } from '../entities/Stay';
import { DefaultTask } from '../entities/DefaultTasks';

const staysRouter = Router();

staysRouter.use(authenticateToken);

staysRouter.post('/', async (req, res) => {
  const stayRepo = AppDataSource.getRepository(Stay);
  const stay = await stayRepo.create(req.body as Stay);
  const saved = await stayRepo.save(stay);
  // Templates zu Tasks kopieren (Standard-Listen)
  const defaultTasks = await AppDataSource.getRepository(DefaultTask).find();
  for (const t of defaultTasks) {
    const task = AppDataSource.getRepository(Task).create({
      ...t,
      stay: saved,
    });
    await AppDataSource.getRepository(Task).save(task);
  }
  res.json(saved);
});

staysRouter.get('/:id/tasks', async (req, res) => {
  const tasks = await AppDataSource.getRepository(Task).find({
    where: { stay: { id: req.params.id } },
    relations: { stay: true },
  });
  if (tasks.length === 0) res.status(404);
  res.json(tasks);
});

staysRouter.get('/', async (req, res) => {
  const stays = await AppDataSource.getRepository(Stay).find();

  res.status(200).json({ stays });
});

staysRouter.put('/:id', async (req, res) => {
  const stayRepo = AppDataSource.getRepository(Stay);
  const stay = await stayRepo.findOneBy({
    id: req.params.id,
  });
  if (!stay) return res.status(404);

  if (req.body.title) {
    stay.title = req.body.title;
  }
  if (req.body.startDate) {
    stay.startDate = req.body.startDate;
  }
  if (req.body.endDate) {
    stay.endDate = req.body.endDate;
  }

  stayRepo.save(stay);

  return res.json({ stay });
});

staysRouter.delete('/:id', async (req, res) => {
  const stayRepo = AppDataSource.getRepository(Stay);
  const stay = await stayRepo.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!stay) return res.status(404);

  await stayRepo.remove(stay);

  return res.status(204).send();
});
export default staysRouter;
