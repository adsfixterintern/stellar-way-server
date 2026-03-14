import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import connectDB from './app/config/db';
import globalRoutes from './app/routes/index';

const app = express();
const PORT = config.port;

// middleware
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('stellar way Server is Live!');
});


app.use('/api/v1', globalRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
