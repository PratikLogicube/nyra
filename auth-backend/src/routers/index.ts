import { Router } from "express";
import userRouter from "./user";
import validationRouter from "./validation";

const appRouter = Router();
// Define the base path for the API
// appRouter.use("/api/v1/auth", appRouter);
// appRouter.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });
appRouter.use("/user", userRouter);
appRouter.use("/validate", validationRouter);

export default appRouter;
