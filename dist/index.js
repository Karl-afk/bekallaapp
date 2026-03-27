"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const myVariable = process.env.MYVARIABLE || 'default';
app.get('/', (req, res) => {
    res.send('Hello World! from E, myVar: ' + myVariable);
});
app.listen(port, () => {
    console.log(`App is running... (port: ${port})`);
});
