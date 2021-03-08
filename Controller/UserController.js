const asyncHandler = require('express-async-handler');
const { User } = require('../Model/UserModel');
const { generateToken } = require('../Utility/GenerateToken');

//@desc Authenticate user
//@route GET /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@desc Get User profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc Register User
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: req.body.isAdmin,
  });

  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid user data');
  }
});

//@desc Update User profile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//#######ADMIN###########ADMIN#####ADMIN###############ADMIN##########ADMIN#########ADMIN#############ADMIN######

//@desc Get all users
//@route GET /api/users/
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  const count = await User.countDocuments({});
  console.log(count);
  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

//@desc Delete  user
//@route GET /api/users/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc Update User profile
//@route PUT /api/users/profile
//@access private
const updateUserProfileAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getAllUsers,
  getUserProfile,
  authUser,
  registerUser,
  updateUserProfile,
  updateUserProfileAdmin,
  deleteUser,
};
