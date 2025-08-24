import { Router } from "express";
import {
  getUser,
  registerUser,
  loginUser,
  getUserById,
} from "../handlers/user-handler";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";

const userRouter = Router();
// userRouter.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });
userRouter.get("/:id", getUserById);
userRouter.get("/profile/me", validateAuthTokens, getUser);

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
