import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { MAX_PDF_SIZE } from '../constanst.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_PDF_SIZE,
        files: 1
    },
    fileFilter:(req, file, cb) => {
        if(file.mimetype !== 'application/pdf'){
            return cb(new ApiError(400, 'Only PDF files are allowed'));
        }
        cb(null, true);
    }
})

export const uploadPdf = upload.single('file');