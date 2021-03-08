const express = require('express');
const router = express.Router();
const upload = require('../Config/Multer');
const { protect, admin } = require('../Middleware/AuthMiddleware');

const {
  getProducts,
  getProductById,
  uploadImage,
  updateImage,
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsAdmin,
  getProductsByCategory,
  getProductsByBrand,
  getTopProducts,
  getRelatedProducts,
  addProductReview,
} = require('../Controller/ProductController');

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProductController);

router.route('/category').get(getProductsByCategory);
router.route('/brand').get(getProductsByBrand);
router.route('/topproducts').get(getTopProducts);
router.route('/relatedProducts').get(getRelatedProducts);
router.route('/relatedProducts').get(getRelatedProducts);
router.route('/:id/reviews').post(protect, addProductReview);

router.route('/admin').get(getProductsAdmin);
router.route('/image/upload').post(upload.single('image'), uploadImage);
router.route('/image/update/:id').post(upload.single('image'), updateImage);

router
  .route('/:id')
  .get(getProductById)
  .post(protect, admin, updateProductController);

router.route('/delete/:id').get(protect, admin, deleteProductController);

module.exports = router;
