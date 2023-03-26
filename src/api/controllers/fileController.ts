import { Router } from "express";
import multer from "multer";
import os from "os";

import uploadFileService from "../services/uploadFileService";

const upload = multer({ dest: os.tmpdir() });

const router = Router();

router.post("/", upload.single("file"), uploadFileService);

export default router;
