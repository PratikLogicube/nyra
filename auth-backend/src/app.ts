import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import appRouter from "./routers";
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET!));

app.use(express.json());
app.use(cors({ origin: "*" })); // for dev only

app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Logging middleware
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("Request received");
  console.log("req url", req.baseUrl + req.url);

  console.log(JSON.stringify(req.headers));
  next();
});

app.use("/api/v1/auth", appRouter);

// Demonstration endpoint for health check
// This can be used to check if the server is running
// url: http://your_domain/api/v1/auth/health
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

export default app;
