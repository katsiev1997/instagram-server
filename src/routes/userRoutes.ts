// routes/userRoutes.js

import express from "express";
import { findUsers, getUserProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:username", authMiddleware, getUserProfile);
router.get("/get/:username", authMiddleware, findUsers);

export default router;
