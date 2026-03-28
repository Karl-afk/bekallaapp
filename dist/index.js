"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./src/data-source");
const Task_1 = require("./src/entities/Task");
const Stay_1 = require("./src/entities/Stay");
const authenticateToken_1 = require("./src/middleware/authenticateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("./src/entities/User");
const tokenHelper_1 = require("./src/helper/tokenHelper");
data_source_1.AppDataSource.initialize()
    .then(() => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 3000;
    const myVariable = process.env.MYVARIABLE || 'default';
    const registerActive = process.env.REGISTER_ACTIVE || true;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // app.use(authenticateToken);
    app.get('/', (req, res) => {
        res.send('Hello World! from E, myVar: ' + myVariable);
    });
    if (registerActive) {
        app.post('/register', async (req, res) => {
            const { name, email, password } = req.body;
            if (!name || !email || !password)
                return res.status(422);
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.create({
                name,
                email,
                password: hashedPassword,
            });
            const saved = await userRepo.save(user);
            const token = (0, tokenHelper_1.generateToken)(saved);
            res.status(201).json({ message: 'User registered', token });
        });
    }
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(422);
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const existintUser = await userRepo.findOneBy({ email: email });
        if (existintUser &&
            (await bcryptjs_1.default.compare(password, existintUser.password))) {
            const token = (0, tokenHelper_1.generateToken)(existintUser);
            return res.json({ token, message: 'successfully logged in' });
        }
        res.status(400).json({ message: 'Invalid credentials' });
    });
    // Routes
    app.post('/stays', authenticateToken_1.authenticateToken, async (req, res) => {
        const stayRepo = data_source_1.AppDataSource.getRepository(Stay_1.Stay);
        const stay = await stayRepo.create(req.body);
        const saved = await stayRepo.save(stay);
        // Templates zu Tasks kopieren (Standard-Listen)
        const defaultTasks = [
            { title: 'Milch', category: 'shopping' },
            { title: 'Klopapier', category: 'shopping' },
            { title: 'Bettwäsche gewaschen', category: 'departure' },
            { title: 'Fenster zu', category: 'departure' },
        ];
        for (const t of defaultTasks) {
            const task = data_source_1.AppDataSource.getRepository(Task_1.Task).create({
                ...t,
                stay: saved,
            });
            await data_source_1.AppDataSource.getRepository(Task_1.Task).save(task);
        }
        res.json(saved);
    });
    app.get('/stays/:id/tasks', authenticateToken_1.authenticateToken, async (req, res) => {
        console.log('🚀 ~ req:', req.user);
        const tasks = await data_source_1.AppDataSource.getRepository(Task_1.Task).find({
            where: { stay: { id: req.params.id } },
            relations: { stay: true },
        });
        if (tasks.length === 0)
            res.status(404);
        res.json(tasks);
    });
    app.put('/tasks/:id', async (req, res) => {
        const task = await data_source_1.AppDataSource.getRepository(Task_1.Task).findOneBy({
            id: req.params.id,
        });
        if (!task)
            return res.status(404);
        data_source_1.AppDataSource.getRepository(Task_1.Task).merge(task, req.body);
        const updated = await data_source_1.AppDataSource.getRepository(Task_1.Task).save(task);
        res.json(updated);
    });
    app.listen(port, () => {
        console.log(`App is running... (port: ${port})`);
    });
})
    .catch((error) => {
    console.log(`Error while DB connection:`);
    console.log(error);
});
