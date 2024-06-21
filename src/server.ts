import express = require('express');
import cors = require('cors');
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

db.sequelize.sync();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tiagosc application' });
});

authRoutes(app);
userRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});