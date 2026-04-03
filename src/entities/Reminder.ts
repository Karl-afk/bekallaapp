import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

export enum ReminderFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM_CRON = 'custom_cron',
}

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: ReminderFrequency })
  frequency: ReminderFrequency;

  // Für ONCE: ISO-Datum, für WEEKLY: 0-6 (Wochentag), für MONTHLY: 1-31
  @Column({ type: 'varchar', length: 200, nullable: true })
  scheduleValue: string;

  // Uhrzeit z.B. "18:00"
  @Column('varchar', { length: 200 })
  time: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
