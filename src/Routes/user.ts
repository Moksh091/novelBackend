import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import zod from "zod";
const prisma = new PrismaClient();
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import path from "path";
import express from "express";
export const userRouter = Router();

// userRouter.use(express.static(path.join(__dirname, "public")));

// userRouter.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true },
//   })
// );

passport.use(
  new Strategy(async function verify(Email, Password, done) {
    console.log(Email, Password)
    try {
      // const signinSchema = zod.object({ 
      //   Email: zod.string().email(),
      //   Password: zod.string().min(8),
      // });
      // const validateData = signinSchema.parse({ Email, Password });
      const User = await prisma.user.findFirst({
        where: {
          Email: Email
        },
      });
      if (!User) {
        return done(null, false, { message: "Incorrect Email" });
      }
      const password = await bcrypt.compare(User.Password, Password);
      if (!password) {
        return done(null, false, { message: "Incorrect Password" });
      }

      return done(null, User);
    } catch (error) {
      return done(error);
    }
  })
);

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
userRouter.get("/login", function (req, res, next) {
  res.status(401).json("login failed");
});

userRouter.post("/signin/password", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/api/v1/user/login",
  })
)

// userRouter.use(passport.authenticate("session"));

userRouter.post("/signup", async function (req: Request, res: Response) {
  const signupSchema = zod.object({
    FirstName: zod.string(),
    Email: zod.string().email(),
    Password: zod.string().min(8),
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
    bcrypt.hash(req.body.Password, 10, async function (err, hash) {
      if (err) {
        throw err;
      }

      await prisma.user.create({
        data: {
          FirstName: body.FirstName,
          Email: body.Email,
          Password: hash,
        },
      });
    });

    res.status(200).json({ message: "User Created successfully" });
    return;
  } catch (error) {
    console.log(error);
    return;
  }
});
