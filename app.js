const express = require("express");
const app = express();
const userRoute = require("./Routes/userRoute");
const propertyRouter = require("./Routes/propertyRoute");
const reviewRouter = require("./Routes/reviewRoute");
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

app.use("/api/v1/users", userRoute);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

const { Server } = require("socket.io");

const io = new Server(3500, {
  cors: corsOptions,
});
let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  const userExists = onlineUsers.some((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
    console.log("User added:", { userId, socketId });
  } else {
    console.log("User already exists:", userId);
  }
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("con");

  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
  });
  socket.on("activateDisActivate", ({ receiverId, adminId, value }) => {
    const receiver = getUser(receiverId);
    io.to(receiver?.socketId).emit("getNotification", "here is a test");
  });

  socket.on("disconnect", () => {
    console.log("disCon");
    removeUser(socket.id);
  });
});

app.use(globalErrorHandler);
module.exports = app;
