const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

const signToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, address } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    address,
  });
  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("please enter your email and password", 403));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.passwordCorrect(password, user.password))
    return next(new AppError("invalid email or password", 404));

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("no user found", 404));

  const resetToken = user.createPasswordResatToken();
  user.save({ validateBeforeSave: true });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `if you forget your password use this ${resetURL} else ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: "it is valid for 10 min",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token sended to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "there wes an error sending the email! please try again later",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const { password, passwordConfirm } = req.body;

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("the token is invalid or expired", 404));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select("+password");
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError("your current password is wrong", 401));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;

//   await user.save();
//   createSendToken(user, 200, res);
// });
