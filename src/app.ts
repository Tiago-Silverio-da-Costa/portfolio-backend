import express from 'express';
import cors from 'cors';
import db from './models';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bodyParser from 'body-parser';
import api from '../api';

const app = express();

app.use(cors())

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

db.sequelize.sync();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tiagosc application' });
});

app.use('/api/v1', api);

authRoutes(app);
userRoutes(app);

export default app