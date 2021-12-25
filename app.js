const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');

const { connectDB } = require('./Config/db');
const productRoutes = require('./Routes/ProductRoutes');
const userRoutes = require('./Routes/UserRoutes');
const orderRoutes = require('./Routes/OrderRoutes');
const { notFoundError, errorHandler } = require('./Middleware/errorMiddleware.js');

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server running....');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

app.use(notFoundError);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.green.bold));
