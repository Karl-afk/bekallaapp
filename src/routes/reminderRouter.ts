import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Reminder, ReminderFrequency } from '../entities/Reminder';
import { authenticateToken } from '../middleware/authenticateToken';

export const reminderRouter = Router();
reminderRouter.use(authenticateToken);

// GET /api/reminders
reminderRouter.get('/', async (req, res) => {
  const repo = AppDataSource.getRepository(Reminder);
  const reminders = await repo.find({
    order: { createdAt: 'DESC' },
  });
  return res.json({ reminders });
});

// POST /api/reminders
reminderRouter.post('/', async (req, res) => {
  const repo = AppDataSource.getRepository(Reminder);
  const { title, body, frequency, scheduleValue, time } = req.body;

  if (!title || !frequency || !time) {
    return res
      .status(400)
      .json({ message: 'title, frequency and time are required' });
  }

  const reminder = repo.create({
    title,
    body,
    frequency,
    scheduleValue,
    time,
    isActive: true,
    user: req.user,
  });

  await repo.save(reminder);
  return res.status(201).json({ reminder });
});

// PUT /api/reminders/:id
reminderRouter.put('/:id', async (req, res) => {
  const repo = AppDataSource.getRepository(Reminder);

  const reminder = await repo.findOne({
    where: { id: req.params.id, user: { id: req.user?.id } },
  });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

  const { title, body, frequency, scheduleValue, time, isActive } = req.body;
  await repo.update(
    { id: req.params.id },
    { title, body, frequency, scheduleValue, time, isActive },
  );

  const updated = await repo.findOneBy({ id: req.params.id });
  return res.json({ reminder: updated });
});

// PATCH /api/reminders/:id/toggle
reminderRouter.patch('/:id/toggle', async (req, res) => {
  const repo = AppDataSource.getRepository(Reminder);

  const reminder = await repo.findOne({
    where: { id: req.params.id, user: { id: req.user?.id } },
  });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

  await repo.update({ id: req.params.id }, { isActive: !reminder.isActive });
  return res.json({ isActive: !reminder.isActive });
});

// DELETE /api/reminders/:id
reminderRouter.delete('/:id', async (req, res) => {
  const repo = AppDataSource.getRepository(Reminder);

  const reminder = await repo.findOne({
    where: { id: req.params.id, user: { id: req.user?.id } },
  });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

  await repo.remove(reminder);
  return res.status(204).send();
});
