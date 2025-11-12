import express from 'express';
import { addFile, getAllFile, getFileById} from '../controller/file.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { protectRoute, isTeacher } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/',getAllFile)
router.get('/:id',getFileById)
router.post('/addfile',protectRoute,isTeacher,upload.single("file"),addFile)

export default router;