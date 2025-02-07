"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = "mokshserver";
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(404).json({
            message: "Authorization key not found"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authHeader, exports.JWT_SECRET);
        if (decoded) {
            //@ts-ignore
            req.userId = decoded.userId;
            next();
        }
    }
    catch (error) {
        return res.status(200).json({
            error,
            message: 'auth failed'
        });
    }
}
exports.default = authMiddleware;
