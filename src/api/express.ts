import express from "express";

import fileController from "./controllers/fileController";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use("/api/file", fileController);

export default expressApp;
