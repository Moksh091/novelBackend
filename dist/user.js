"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
exports.userRouter = (0, express_1.Router)();
// const signupSchema = zod.object({
// })
exports.userRouter.post("/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        console.log(" coming ");
        // const { success } = signupSchema.safeParse(body);
        // if (!success) {
        //     res.status(400).json({
        //         message: "Invalid inputs"
        //     })
        //     return;
        // }
        try {
            const user = yield prisma.user.create({
                data: {
                    FirstName: body.FirstName,
                    Email: body.Email,
                    Password: body.Password,
                }
            });
            res.status(200).json({ message: "User Created successfully" });
            return;
        }
        catch (error) {
            console.log(error);
            return;
        }
    });
});
const signinSchema = zod_1.default.object({});
exports.userRouter.get("/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
});
