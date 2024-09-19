const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A conversation must have a sender"],
      },
      receiver: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A conversation must have a receiver"],
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
