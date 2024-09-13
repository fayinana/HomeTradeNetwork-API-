const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});
console.log(process.env.LOCAL_DATABASE);
mongoose
  .connect(process.env.LOCAL_DATABASE)
  .then((con) => {
    console.log("Database connected:", con.connection.name);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
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
