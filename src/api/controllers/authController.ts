import { Router } from "express";

import { createJWTToken } from "../../services/restServices/authService";

const router = Router();

router.post("/", createJWTToken);

export default router;
