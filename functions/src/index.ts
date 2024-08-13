import express from 'express';
import cors from 'cors';
import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import bodyParser from 'body-parser';
import functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const app = express();

app.use(cors({
  origin: "https://www.tiagosc.com.br",
  preflightContinue: true,
  credentials: true
}))

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

db.sequelize.sync();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tiagosc application' });
});

authRoutes(app);
userRoutes(app);

export const api = functions.https.onRequest(app);