import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './Config/db.js';

import users from './Data/users.js';
import products from './Data/products.js';

import Product from './Model/ProductModel.js';
import User from './Model/UserModel.js';
import Order from './Model/OrderModel.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0];

    const sampleProducts = products.map((prod) => {
      return { ...prod, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log(`Data Imported!`.green.inverse);
    process.exit();
  } catch (error) {
    console.errorg(`${erros}`.red.inverse);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log(`Data Deleted!`.yellow.inverse);
    process.exit();
  } catch (error) {
    console.errorg(`${erros}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
