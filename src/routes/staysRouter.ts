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
  const stay = await AppDataSource.getRepository(Stay).findOne({
    where: { id: req.params.id },
    relations: { tasks: true },
  });
  console.log('🚀 ~ tasks:', stay);
  if (!stay) res.status(404);
  res.json(stay);
});

staysRouter.get('/', async (req, res) => {
  const stays = await AppDataSource.getRepository(Stay).find({
    relations: { tasks: true },
  });

  res.status(200).json({ stays });
});

staysRouter.put('/:id', async (req, res) => {
  const stayRepo = AppDataSource.getRepository(Stay);
  const taskRepo = AppDataSource.getRepository(Task);
  const stay = await stayRepo.findOne({
    where: { id: req.params.id },
    relations: { tasks: true },
  });
  if (!stay) return res.status(404);

  const updateData: Partial<Stay> = {};

  if (req.body.title !== undefined) {
    updateData.title = req.body.title;
  }
  if (req.body.startDate !== undefined) {
    updateData.startDate = req.body.startDate;
  }
  if (req.body.endDate !== undefined) {
    updateData.endDate = req.body.endDate;
  }

  await stayRepo.update({ id: req.params.id }, updateData);

  if (Array.isArray(req.body.tasks)) {
    const incomingIds = req.body.tasks
      .filter((t: any) => t.id)
      .map((t: any) => t.id);

    // Tasks löschen die nicht mehr im Array sind
    const toDelete = stay.tasks.filter((t) => !incomingIds.includes(t.id));
    if (toDelete.length > 0) {
      await taskRepo.remove(toDelete);
    }
    for (const taskData of req.body.tasks) {
      if (taskData.id) {
        // Bestehenden Task updaten
        await taskRepo.update(
          { id: taskData.id },
          {
            title: taskData.title,
            category: taskData.category,
            isDone: taskData.isDone,
            amount: taskData.amount ?? null,
          },
        );
      } else {
        // Neuen Task erstellen
        const newTask = taskRepo.create({
          title: taskData.title,
          category: taskData.category,
          isDone: taskData.isDone ?? false,
          amount: taskData.amount ?? null,
          stay: stay,
        });
        await taskRepo.save(newTask);
      }
    }
  }

  const updatedStay = await stayRepo.findOne({
    where: { id: req.params.id },
    relations: { tasks: true },
  });

  return res.json({ updatedStay });
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
