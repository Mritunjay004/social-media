import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/:userId/follow", requiresAuth, UserController.follow);

router.post("/:userId/unfollow", requiresAuth, UserController.unfollow);

router.get("/", UserController.getUsers);

export default router;
