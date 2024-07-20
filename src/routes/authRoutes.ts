// routes/authRoutes.js

import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh_token", authController.generateAccessToken);
router.get("/logout", authController.logout);

export default router;
