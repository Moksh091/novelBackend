import { NextFunction, Request, request, Response } from "express";
import Jwt from "jsonwebtoken";
export const JWT_SECRET = "mokshserver";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(404).json({
            message: "Authorization key not found"
        })
    }
    try {
        const decoded = Jwt.verify(authHeader, JWT_SECRET);
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
        })
    }
}

export default authMiddleware;