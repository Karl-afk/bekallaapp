import cron from 'node-cron';
import { AppDataSource } from '../data-source';
import { Stay } from '../entities/Stay';
import { PushSubscription } from '../entities/PushSubscription';
import { notificationService } from './notification.service';
import { Reminder, ReminderFrequency } from '../entities/Reminder';

export function startScheduler() {
  // Reminder-Jobs alle 1 Minute prüfen
  cron.schedule(
    '* * * * *',
    async () => {
      await processReminders();
    },
    { timezone: 'Europe/Berlin' },
  );
  // ─── Restmüll: Jeden Dienstag 18:00 Uhr ────────────────────────────────────
  // Cron: 0 18 * * 2  (Minute Stunde Tag Monat Wochentag | 2=Dienstag)
  cron.schedule(
    '0 18 * * 2',
    async () => {
      console.log('[CRON] Restmüll-Erinnerung...');
      await sendTrashReminder({
        title: '🗑️ Restmüll rausstellen!',
        body: 'Morgen früh wird der Restmüll geleert.',
      });
    },
    { timezone: 'Europe/Berlin' },
  );

  // ─── Plastikmüll: Jeden 3. Donnerstag im Monat 18:00 Uhr ───────────────────
  // Cron läuft jeden Donnerstag → im Handler prüfen ob es der 3. ist
  cron.schedule(
    '0 18 * * 4',
    async () => {
      if (!isThirdThursdayOfMonth()) return;
      console.log('[CRON] Plastikmüll-Erinnerung...');
      await sendTrashReminder({
        title: '♻️ Plastikmüll rausstellen!',
        body: 'Morgen früh wird der Plastikmüll geleert.',
      });
    },
    { timezone: 'Europe/Berlin' },
  );

  console.log('[CRON] Scheduler gestartet ✅');
}

// ─── Nur an aktive Aufenthalte senden ──────────────────────────────────────────
async function sendTrashReminder(message: { title: string; body: string }) {
  const stayRepo = AppDataSource.getRepository(Stay);
  const subRepo = AppDataSource.getRepository(PushSubscription);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Prüfen ob aktuell ein aktiver Aufenthalt existiert
  const activeStay = await stayRepo
    .createQueryBuilder('stay')
    .where('stay.startDate <= :today', { today })
    .andWhere('stay.endDate >= :today', { today })
    .getOne();

  if (!activeStay) {
    console.log('[CRON] Kein aktiver Aufenthalt → keine Notification');
    return;
  }

  // Alle Subscriptions benachrichtigen
  const subscriptions = await subRepo.find();
  await notificationService.sendToAll(subscriptions, {
    ...message,
    url: `/stays/${activeStay.id}`,
  });
}

// ─── Hilfsfunktion: 3. Donnerstag im Monat? ─────────────────────────────────
function isThirdThursdayOfMonth(): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 4 = Donnerstag
  const dayOfMonth = today.getDate(); // 1-31

  return dayOfWeek === 4 && dayOfMonth >= 15 && dayOfMonth <= 21;
}
async function processReminders() {
  const repo = AppDataSource.getRepository(Reminder);
  const now = new Date();

  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentWeekday = now.getDay(); // 0=So, 1=Mo, ..., 6=Sa
  const currentDay = now.getDate(); // 1-31

  const reminders = await repo.find({
    where: { isActive: true },
    relations: { user: true },
  });

  for (const reminder of reminders) {
    if (reminder.time !== currentTime) continue;

    let shouldSend = false;

    switch (reminder.frequency) {
      case ReminderFrequency.DAILY:
        shouldSend = true;
        break;

      case ReminderFrequency.WEEKLY:
        // scheduleValue = Wochentag "1" = Montag
        shouldSend = Number(reminder.scheduleValue) === currentWeekday;
        break;

      case ReminderFrequency.MONTHLY:
        // scheduleValue = Tag im Monat "15"
        shouldSend = Number(reminder.scheduleValue) === currentDay;
        break;

      case ReminderFrequency.ONCE:
        // scheduleValue = ISO-Datum "2026-04-10"
        const reminderDate = new Date(reminder.scheduleValue!);
        shouldSend = reminderDate.toDateString() === now.toDateString();
        if (shouldSend) {
          // Einmalige Reminder nach dem Senden deaktivieren
          await repo.update({ id: reminder.id }, { isActive: false });
        }
        break;
    }

    if (!shouldSend) continue;

    // Subscriptions des Users holen
    const subRepo = AppDataSource.getRepository(PushSubscription);
    const subscriptions = reminder.user
      ? await subRepo.find({ where: { user: { id: reminder.user.id } } })
      : await subRepo.find();

    await notificationService.sendToAll(subscriptions, {
      title: reminder.title,
      body: reminder.body,
      url: '/',
    });

    console.log(`[CRON] Reminder gesendet: "${reminder.title}"`);
  }
}
