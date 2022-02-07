const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../Config/Cloudinary');
const { Product } = require('../Model/ProductModel');

//@desc Fetch all procduct
//@route GET /api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            brand: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            category: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};
  const sortBy = req.query.sortBy || 'latest';
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const priceRange = req.query.priceFilter && req.query.priceFilter.split('-');
  const price =
    priceRange && Boolean(Number(priceRange[1])) ? [Number(priceRange[0]), Number(priceRange[1])] : [0, 10];

  const count = await Product.countDocuments({
    $and: [
      { ...keyword },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  });
  const products = await Product.find({
    $and: [
      { ...keyword },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  })
    .sort(
      sortBy === 'latest'
        ? { createdAt: -1 }
        : sortBy === 'rating '
        ? { rating: -1 }
        : sortBy === 'priceLow'
        ? { price: 1 }
        : sortBy === 'priceHigh'
        ? { price: -1 }
        : {}
    )
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch  procducts by category
//@route GET /api/products/category
//@access public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const sortBy = req.query.sortBy || 'latest';
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const priceRange = req.query.priceFilter && req.query.priceFilter.split('-');
  const price =
    priceRange && Boolean(Number(priceRange[1])) ? [Number(priceRange[0]), Number(priceRange[1])] : [0, 10];

  const category = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({
    $and: [
      { ...category },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  });
  const products = await Product.find({
    $and: [
      { ...category },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  })
    .sort(
      sortBy === 'latest'
        ? { createdAt: -1 }
        : sortBy === 'rating '
        ? { rating: -1 }
        : sortBy === 'priceLow'
        ? { price: 1 }
        : sortBy === 'priceHigh'
        ? { price: -1 }
        : {}
    )
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch procducts by brand
//@route GET /api/products/brand
//@access public
const getProductsByBrand = asyncHandler(async (req, res) => {
  const sortBy = req.query.sortBy || 'latest';
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const priceRange = req.query.priceFilter && req.query.priceFilter.split('-');
  const price =
    priceRange && Boolean(Number(priceRange[1])) ? [Number(priceRange[0]), Number(priceRange[1])] : [0, 10];

  const brand = req.query.brand
    ? {
        brand: {
          $regex: req.query.brand,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({
    $and: [
      { ...brand },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  });
  const products = await Product.find({
    $and: [
      { ...brand },
      price[1] >= 10
        ? { price: { $gte: price[0], $lte: Number.POSITIVE_INFINITY } }
        : { price: { $gte: price[0], $lte: price[1] } },
    ],
  })
    .sort(
      sortBy === 'latest'
        ? { createdAt: -1 }
        : sortBy === 'rating '
        ? { rating: -1 }
        : sortBy === 'priceLow'
        ? { price: 1 }
        : sortBy === 'priceHigh'
        ? { price: -1 }
        : {}
    )
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch top procducts
//@route GET /api/products/top products
//@access public
const getTopProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const products = await Product.find({}).sort({ rating: -1 }).limit(pageSize);
  res.json({ products });
});

//@desc Fetch top products
//@route GET /api/products/top products
//@access public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const category = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: 'i',
        },
      }
    : {};
  const products = await Product.find({ ...category })
    .sort({ rating: -1 })
    .limit(12);
  res.json({ products });
});

//@desc Fetch single products by id
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Add product review
//@route POST /api/products/:id/reviews
//@access public
const addProductReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    (product.numReviews = product.reviews.length),
      (product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length);

    await product.save();
    res.status(201);
    res.json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//########admin#############

//@desc Fetch all products Admin
//@route GET /api/product/admin
//@access public
const getProductsAdmin = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const count = await Product.countDocuments({});
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Create product
//@route POST /api/products/
//@access public/admin
const createProductController = asyncHandler(async (req, res) => {
  const { image, imageId, name, description, price, countInStock, brand, category } = req.body;

  const product = await Product.create({
    user: req.user._id,
    name: name,
    description: description,
    price: price,
    countInStock: countInStock,
    brand: brand,
    category: category,
    image: image,
    imageId: imageId,
  });

  if (product) {
    res.status(201);
    res.json({ message: success });
  } else {
    res.status(401);
    throw new Error('Invaid product data');
  }
});

//@desc update product
//@route POST /api/products/:id
//@access public/admin
const updateProductController = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.image = req.body.updatedImage || product.image;
    product.imageId = req.body.updatedImageId || product.imageId;

    await product.save();

    res.json(product);
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

//@desc Delete product
//@route POST /api/products/delete/:id
//@access public/admin
const deleteProductController = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    data = await cloudinary.uploader.destroy(product.imageId);
    await product.remove();
    res.json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

//@desc Upload product image
//@route POST /api/products/image/upload
//@access public
const uploadImage = asyncHandler(async (req, res) => {
  const imageReceived = req.file.path;
  try {
    const uploadedResponse = await cloudinary.uploader.upload(imageReceived, {
      upload_preset: 'product_images',
    });
    res.json({
      image: uploadedResponse.secure_url,
      imageId: uploadedResponse.public_id,
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

//@desc Update product image
//@route POST /api/products/image/update/:id
//@access public
const updateImage = asyncHandler(async (req, res) => {
  const imageReceived = req.file.path;
  const product = await Product.findById(req.params.id);
  try {
    data = await cloudinary.uploader.destroy(product.imageId);

    const uploadedResponse = await cloudinary.uploader.upload(imageReceived, {
      upload_preset: 'product_images',
    });
    res.json({
      image: uploadedResponse.secure_url,
      imageId: uploadedResponse.public_id,
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

module.exports = {
  uploadImage,
  getProductsAdmin,
  addProductReview,
  getProductsByCategory,
  getProductsByBrand,
  getTopProducts,
  getRelatedProducts,
  updateImage,
  getProducts,
  getProductById,
  createProductController,
  updateProductController,
  deleteProductController,
};
