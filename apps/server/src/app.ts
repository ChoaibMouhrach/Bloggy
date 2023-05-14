import cors from "cors";
import express from "express";
import router from "./Routes";
import { join } from "path";

/**
 * Creates a new express instance
 */
const makeApp = () => {
  const app = express();

  // middlewares
  app.use(cors());
  app.use(express.json());

  // assets
  app.use("/public", express.static(join(__dirname, "public")));

  // routes
  app.use("/api", router);

  return app;
};

export default makeApp;
