// Where you create and configure the Express app: middleware setup (cors, express.json(), cookieParser), and mounting your routes. It only configures the app and does not start the server.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '16kb',
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  }),
);
app.use(express.static('public'));

app.use(cookieParser())

// Routes
import userRouter from './routes/user.routes.js'

// Routes declarations
app.use("/api/v1/users",userRouter)
// Will pass to the users route https://localhost:8000/api/v1/users/login

export { app };
