import webPush from 'web-push';
import { PushSubscription } from '../entities/PushSubscription';
import { AppDataSource } from '../data-source';

class NotificationService {
  async sendToAll(
    subscriptions: PushSubscription[],
    payload: { title: string; body: string; url?: string },
  ) {
    const message = JSON.stringify({
      notification: {
        title: payload.title,
        body: payload.body,
        icon: 'web-app-manifest-192x192.png',
        badge: 'web-app-manifest-192x192.png',
        data: { url: payload.url ?? '/' },
      },
    });

    const subRepo = AppDataSource.getRepository(PushSubscription);

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webPush
          .sendNotification(sub.subscription, message)
          .catch(async (err) => {
            if (err.statusCode === 410) await subRepo.remove(sub); // Abgelaufen
            throw err;
          }),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    console.log(`[PUSH] Sent: ${sent}, Failed: ${failed}`);
  }
}

export const notificationService = new NotificationService();
