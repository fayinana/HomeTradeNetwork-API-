const catchAsync = require("../Utils/catchAsync");
const Conversation = require("./../models/conversationModel");
const factory = require("./handlerFactory");

exports.createConversation = factory.createOne(Conversation);
exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.find({
    $or: [
      { "members.sender": req.user._id },
      { "members.receiver": req.user._id },
    ],
  }).populate([
    { path: "members.sender", select: "name photo" },
    { path: "members.receiver", select: "name photo" },
  ]);
  res.status(200).json({
    status: "success",
    conversation,
  });
});
exports.getConversationForTwoUsers = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    members: { $all: [req.params.firstUserId, req.params.secondUserId] },
  });
  res.status(200).json({
    status: "success",
    conversation,
  });
});
