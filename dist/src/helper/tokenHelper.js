"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(user) {
    const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.name, email: user.email }, SECRET_KEY, { expiresIn: '15m' });
    return token;
}
