"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Stay_1 = require("./entities/Stay");
const Task_1 = require("./entities/Task");
const User_1 = require("./entities/User");
const PushSubscription_1 = require("./entities/PushSubscription");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'bekalla',
    entities: [Stay_1.Stay, Task_1.Task, PushSubscription_1.PushSubscription, User_1.User],
    synchronize: false, // Prod: false + Migrations!
    migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
    logging: false,
    migrationsRun: false,
    migrationsTransactionMode: 'all',
});
