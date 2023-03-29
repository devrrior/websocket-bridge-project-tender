import cors from "cors";
import express from "express";

import authController from "./controllers/authController";
import fileController from "./controllers/fileController";

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use("/api/file", fileController);
expressApp.use("/api/auth", authController);

export default expressApp;
