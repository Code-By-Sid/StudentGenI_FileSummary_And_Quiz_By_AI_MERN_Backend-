import multer from "multer"

const storage = multer.memoryStorage();

const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // pptx
];

const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, DOC/DOCX, and PPT/PPTX files are allowed'), false);
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 *1024*1024}
})