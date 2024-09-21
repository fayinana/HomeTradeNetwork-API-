const express = require("express");
const app = express();
const userRoute = require("./Routes/userRoute");
const propertyRouter = require("./Routes/propertyRoute");
const reviewRouter = require("./Routes/reviewRoute");
const messageRouter = require("./Routes/messageRoute");
const conversationRouter = require("./Routes/conversationRoute");
const bookingRouter = require("./Routes/bookingRoute");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./Utils/appError");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

// ///////////////////////////////

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", { text, senderId });
    } else {
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// ///////////////////////////////

app.use("/api/v1/users", userRoute);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/bookings", bookingRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
