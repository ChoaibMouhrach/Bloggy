import "express-async-errors";
import { join } from "path";
import express from "express";
import cors from "cors";
import { errorHandler } from "./Middlewares";
import router from "./Routes";
import config from "./lib/config";

/**
 * Creates a new express instance
 */
const makeApp = () => {
  const app = express();

  // middlewares
  app.use(
    cors({
      credentials: true,
      origin: [config.CLIENT_URL],
    })
  );
  app.use(express.json());

  // assets
  app.use("/public", express.static(join(__dirname, "public")));

  // routes
  app.use("/api", router);

  // error handling
  app.use(errorHandler);

  return app;
};

export default makeApp;
