import express from 'express';
import { getFileSummary,getFileQuiz } from '../controller/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/:fileId/summary",protectRoute,getFileSummary)
router.get("/:fileId/quiz",protectRoute,getFileQuiz)

export default router;