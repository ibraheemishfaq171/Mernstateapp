import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";

import authRouter from "./routes/auth.route.js";

import listingRouter from "./routes/listingRouter.js";

import cookieParser from "cookie-parser";
import path from "path";

import cors from "cors";
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
const _dirname = path.resolve();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
})
app.use(cookieParser());
app.listen(3000, () => {
  console.log("server is running on 3000 port");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });
// const cors = require("cors");
// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions)); // Use this after the variable declaration
app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "internal server Error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});
