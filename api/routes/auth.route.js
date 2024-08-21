import express from "express";
import {
  google,
  signin,
  signOut,
  signup,
} from "../controller/auth.controller.js";

const router = express();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);
export default router;
