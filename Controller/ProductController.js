import asyncHandler from 'express-async-handler';

import Product from '../Model/ProductModel.js';

//@desc Fetch all procducts
//@route GET /api/products
//@access public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc Fetch single procduct by id
//@route GET /api/products/:id
//@access public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
