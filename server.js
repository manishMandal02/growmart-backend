import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import connectDB from './Config/db.js';
import productRoutes from './Routes/ProductRoutes.js';
import userRoutes from './Routes/UserRoutes.js';
import { notFoundError, errorHandler } from './Middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

app.use(notFoundError);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.green.bold
  )
);
