import express from 'express';
import cors from 'cors';
import db from './models';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
  origin: "https://portfolio-tiagosc.vercel.app",
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

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port http://localhost:${PORT}`);
// });

export default app