// routes/notifications.ts
import webPush from 'web-push';
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { PushSubscription } from '../entities/PushSubscription';
import { authenticateToken } from '../middleware/authenticateToken';

export const notificationRouter = Router();

webPush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// GET /api/notifications/public-key
notificationRouter.get('/public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// POST /api/notifications/subscribe
notificationRouter.post('/subscribe', async (req, res) => {
  const repo = AppDataSource.getRepository(PushSubscription);

  const { endpoint, keys } = req.body;

  // Doppelte Subscription vermeiden
  const existing = await repo.findOneBy({
    subscription: { endpoint: endpoint },
  });
  if (existing) return res.status(200).json({ message: 'Already subscribed' });

  const sub = repo.create({
    subscription: {
      endpoint,
      keys,
    },
  });
  await repo.save(sub);

  return res.status(201).json({ message: 'Subscribed' });
});

// POST /api/notifications/send (z.B. intern aufrufen)
notificationRouter.post('/send', async (req, res) => {
  const repo = AppDataSource.getRepository(PushSubscription);
  const { title, body, url } = req.body;

  const subscriptions = await repo.find();

  const payload = JSON.stringify({
    notification: {
      title,
      body,
      icon: 'web-app-manifest-192x192.png',
      badge: 'web-app-manifest-192x192.png',
      data: { url: url ?? '/' },
    },
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush.sendNotification(sub.subscription, payload).catch(async (err) => {
        // 410 = Subscription abgelaufen → löschen
        if (err.statusCode === 410) await repo.remove(sub);
        throw err;
      }),
    ),
  );

  return res.json({
    sent: results.filter((r) => r.status === 'fulfilled').length,
  });
});
