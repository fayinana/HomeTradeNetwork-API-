const catchAsync = require("./../Utils/catchAsync");
const Message = require("./../models/messageModel");
const factory = require("./handlerFactory");
exports.addSender = (req, res, next) => {
  if (!req.body.sender) req.body.sender = req.user._id;
  next();
};
exports.createMessage = factory.createOne(Message);
exports.getMessage = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });
  res.status(200).json({
    status: "success",
    messages,
  });
});
