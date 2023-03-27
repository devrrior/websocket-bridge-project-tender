import { Router } from "express";
import multer from "multer";
import os from "os";

import { fileService } from "../../services/restServices/fileService";

const upload = multer({ dest: os.tmpdir() });

const router = Router();

router.post("/", upload.single("file"), fileService);

export default router;
