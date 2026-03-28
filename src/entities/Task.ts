import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Stay } from './Stay';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column({
    type: 'enum',
    enum: ['shopping', 'departure'],
    default: 'shopping',
  })
  category: 'shopping' | 'departure';

  @Column({ type: 'bool', default: false })
  isDone: boolean;

  @ManyToOne(() => Stay, (stay) => stay.tasks)
  stay: Stay;
}
