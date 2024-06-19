import express from 'express';
import cors from 'cors';
import db from './models';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const Role = db.Role;

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: 'user'
  });

  Role.create({
    id: 2,
    name: 'admin'
  });
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tiagosc application' });
});

authRoutes(app);
userRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});