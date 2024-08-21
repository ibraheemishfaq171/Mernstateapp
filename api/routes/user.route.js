import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  test,
  updateUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
// router.get("/test", (req, res) => {
//   // res.send("Hello word");
//   res.json({
//     message: "hello word json api",
//   });
// });
router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);

router.get("/:id", verifyToken, getUser);
export default router;
