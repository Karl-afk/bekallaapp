import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { authenticateToken } from '../middleware/authenticateToken';
import { Stay } from '../entities/Stay';
import { DeleteResult } from 'typeorm';

const staysRouter = Router();

staysRouter.use(authenticateToken);

staysRouter.post('/', async (req, res) => {
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

  res.json({ stays });
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

staysRouter.put('/:id', async (req, res) => {
  const stayRepo = AppDataSource.getRepository(Stay);
  const stay = await stayRepo.findOneBy({
    id: req.params.id,
  });
  if (!stay) return res.status(404);

  await stayRepo.delete(stay);

  return res.status(204);
});

export default staysRouter;
