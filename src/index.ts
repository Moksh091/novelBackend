import express from 'express';
import cors from 'cors';
import { router } from './Routes';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import path from 'path';

const app = express();
const port = process.env.port || 3000;


app.use(express.json());
// app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));

app.use('/api/v1', router );

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
