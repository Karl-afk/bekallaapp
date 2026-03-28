import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('push_subscriptions')
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  subscription: any; // { endpoint, keys: {p256dh, auth} }

  @Column({ type: 'bool', default: true })
  active: boolean;
}
