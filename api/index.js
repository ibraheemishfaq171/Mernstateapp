import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
dotenv.config();
// mongoose.connect().then(() => {
//   console.log("connected to mongodb").catch((err) => {
//     console.log(err);
//   });
// });
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to mongodbconnection");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.listen(3000, () => {
  console.log("server is running on 3000 port");
});

app.use("/api/user", userRoute);
