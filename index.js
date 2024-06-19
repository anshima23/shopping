const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL_LOCAL)
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
   app.use(express.json());
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log("Backend server is running!");
});
