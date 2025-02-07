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
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
exports.userRouter = (0, express_1.Router)();
// userRouter.use(express.static(path.join(__dirname, "public")));
// userRouter.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true },
//   })
// );
passport_1.default.use(new passport_local_1.Strategy(function verify(Email, Password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(Email, Password);
        try {
            // const signinSchema = zod.object({ 
            //   Email: zod.string().email(),
            //   Password: zod.string().min(8),
            // });
            // const validateData = signinSchema.parse({ Email, Password });
            const User = yield prisma.user.findFirst({
                where: {
                    Email: Email
                },
            });
            if (!User) {
                return done(null, false, { message: "Incorrect Email" });
            }
            const password = yield bcrypt_1.default.compare(User.Password, Password);
            if (!password) {
                return done(null, false, { message: "Incorrect Password" });
            }
            return done(null, User);
        }
        catch (error) {
            return done(error);
        }
    });
}));
// passport.serializeUser(function (user: any, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id });
//   });
// });
// passport.deserializeUser(function (user: any, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });
exports.userRouter.get("/login", function (req, res, next) {
    res.status(401).json("login failed");
});
exports.userRouter.post("/signin/password", passport_1.default.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/api/v1/user/login",
}));
// userRouter.use(passport.authenticate("session"));
exports.userRouter.post("/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const signupSchema = zod_1.default.object({
            FirstName: zod_1.default.string(),
            Email: zod_1.default.string().email(),
            Password: zod_1.default.string().min(8),
        });
        const body = req.body;
        const { success } = signupSchema.safeParse(body);
        if (!success) {
            res.status(400).json({
                message: "Invalid inputs",
            });
            return;
        }
        try {
            bcrypt_1.default.hash(req.body.Password, 10, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        throw err;
                    }
                    yield prisma.user.create({
                        data: {
                            FirstName: body.FirstName,
                            Email: body.Email,
                            Password: hash,
                        },
                    });
                });
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
