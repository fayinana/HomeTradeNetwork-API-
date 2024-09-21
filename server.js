const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("Database connected:", con.connection.name);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION", err);
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION", err);
  server.close(() => {
    process.exit(1);
  });
});
