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

app.use(globalErrorHandler);
module.exports = app;
