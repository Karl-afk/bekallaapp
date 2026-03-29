import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity('stays')
export class Stay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @OneToMany(() => Task, (task) => task.stay, { cascade: true })
  tasks: Task[];
}
