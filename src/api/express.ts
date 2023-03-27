import express from "express";

import fileController from "./controllers/fileController";
import authController from "./controllers/authController";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use("/api/file", fileController);
expressApp.use("/api/auth", authController);

export default expressApp;
