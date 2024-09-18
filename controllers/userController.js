const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const User = require("./../models/userModel");
const AppError = require("./../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image! please upload only image "), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`file/image/user/${req.file.filename}`);

  next();
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(201).json({
    status: "error",
    message: "this route is not defined! please use /signup route instead",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const githubURL =
    "https://raw.githubusercontent.com/fayinana/HomeTradeNetwork-API-/main/file/image/user/";
  if (req.body.password) {
    return next(
      new AppError(
        "this is not the route to change password! user updateMyPassword",
        404
      )
    );
  }
  const filteredBody = filterObj(req.body, "name", "email", "phone", "address");
  if (req.file) filteredBody.photo = `${githubURL}${req.file.filename}`;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(203).json({
    status: "success",
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// FOR ADMIN
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, {
  path: "properties",
  select: "title isActive price type",
});
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
