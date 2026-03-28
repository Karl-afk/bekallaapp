import { DataSource } from 'typeorm';
import { Stay } from './entities/Stay';
import { Task } from './entities/Task';
import { User } from './entities/User';
import { PushSubscription } from './entities/PushSubscription';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'bekalla',
  entities: [Stay, Task, PushSubscription, User],
  synchronize: false, // Prod: false + Migrations!
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
  logging: false,

  migrationsRun: false,
  migrationsTransactionMode: 'all',
});
