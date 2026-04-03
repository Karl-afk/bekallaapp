import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('push_subscriptions')
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  subscription: any; // { endpoint, keys: {p256dh, auth} }

  @Column({ type: 'bool', default: true })
  active: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null;
}
