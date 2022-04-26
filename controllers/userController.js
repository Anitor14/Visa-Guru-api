const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
  catchAsync,
} = require("../utils");

const getAllUsers = catchAsync(async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password"); // this is getting the user with role user, but excluding the password hence the .select("-password")
  res.status(StatusCodes.OK).json({ users });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
});

const showCurrentUser = catchAsync(async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

// update user with user.save();
const updateUser = catchAsync(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError(
      "Please provide all the needed Values"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
});

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("please provide both values ");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await User.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
