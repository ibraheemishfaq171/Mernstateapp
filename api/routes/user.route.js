import express from "express";
import { test } from "../controller/user.controller.js";
const router = express.Router();
// router.get("/test", (req, res) => {
//   // res.send("Hello word");
//   res.json({
//     message: "hello word json api",
//   });
// });
router.get("/test", test);
export default router;
