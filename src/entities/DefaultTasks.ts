import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Stay } from './Stay';

@Entity('default_tasks')
export class DefaultTask {
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

  @Column({
    type: 'smallint',
    nullable: true,
  })
  amount: number;
}
