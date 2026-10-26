import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'; // adjust to your real file/name
import { uploadPdfFile } from '../middlewares/upload.middleware.js';
import { validateObjectId } from '../validators/pdf.validator.js';
import {
  uploadPdf,
  downloadPdf,
  updatePdf,
  deletePdf,
  getMyPdfs,
  deleteAllMyPdfs,
  getLibrary,
} from '../controllers/pdf.controller.js';

// Mounted at /api/pdfs
export const pdfRouter = Router();
pdfRouter.use(verifyJWT);

pdfRouter.get('/library', getLibrary); // keep above the /:pdfId route
pdfRouter.get('/', getMyPdfs);
pdfRouter.delete('/', deleteAllMyPdfs);
pdfRouter.get('/:pdfId/download', validateObjectId('pdfId'), downloadPdf);

// Mounted at /api/resources/:resourceId/pdf
export const resourcePdfRouter = Router({ mergeParams: true });
resourcePdfRouter.use(verifyJWT, validateObjectId('resourceId'));

resourcePdfRouter.post('/', uploadPdfFile, uploadPdf);
resourcePdfRouter.put('/', uploadPdfFile, updatePdf);
resourcePdfRouter.delete('/', deletePdf);