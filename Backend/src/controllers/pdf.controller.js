import { Pdf } from '../models/pdf.model.js';
import { Resource } from '../models/resource.model.js'; // adjust to your real path
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { PDF_FOLDER, DOWNLOAD_LINK_EXPIRY } from '../constanst.js';
import {
  uploadToR2,
  deleteFromR2,
  deleteManyFromR2,
  getDownloadUrl,
} from '../services/r2.service.js';

// ---------- helpers ----------

// form-data sends booleans as the strings "true"/"false"
const parseBool = (v) => (v === undefined ? undefined : v === true || v === 'true');

// Real PDFs start with "%PDF-" (the mimetype alone can be faked)
const assertRealPdf = (file) => {
  if (!file) throw new ApiError(400, 'PDF file is required (form-data key: "file")');
  if (file.buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new ApiError(400, 'File is not a valid PDF');
  }
};

// Finds the logged-in user's own Book, or throws
const getOwnBook = async (resourceId, userId) => {
  const resource = await Resource.findOne({ _id: resourceId, user: userId });
  if (!resource) throw new ApiError(404, 'Resource not found');
  if (resource.type !== 'Book') throw new ApiError(400, 'PDFs are only allowed for Books');
  return resource;
};

const buildKey = (userId, resourceId) => `${PDF_FOLDER}/${userId}/${resourceId}.pdf`;

// ---------- 1. UPLOAD ----------
export const uploadPdf = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const userId = req.user._id;

  await getOwnBook(resourceId, userId);
  assertRealPdf(req.file);

  if (await Pdf.exists({ resource: resourceId })) {
    throw new ApiError(409, 'This book already has a PDF. Use update instead');
  }

  const key = buildKey(userId, resourceId);
  await uploadToR2(key, req.file.buffer);

  try {
    const pdf = await Pdf.create({
      user: userId,
      resource: resourceId,
      fileName: req.file.originalname,
      key,
      size: req.file.size,
      isPublic: parseBool(req.body.isPublic) ?? false,
    });
    res.status(201).json(new ApiResponse(201, pdf, 'PDF uploaded'));
  } catch (err) {
    await deleteFromR2(key).catch(() => {}); // don't leave an orphan file in R2
    throw err;
  }
});

// ---------- 2. DOWNLOAD (owner, or anyone if public) ----------
export const downloadPdf = asyncHandler(async (req, res) => {
  const pdf = await Pdf.findById(req.params.pdfId);
  const isOwner = pdf && pdf.user.equals(req.user._id);

  // 404 (not 403) for private files, so strangers can't tell they exist
  if (!pdf || (!pdf.isPublic && !isOwner)) throw new ApiError(404, 'PDF not found');

  const url = await getDownloadUrl(pdf.key, pdf.fileName);
  res.json(
    new ApiResponse(200, { url, expiresInSeconds: DOWNLOAD_LINK_EXPIRY }, 'Download link created')
  );
});

// ---------- 3. UPDATE (replace file and/or change isPublic) ----------
export const updatePdf = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const userId = req.user._id;

  await getOwnBook(resourceId, userId);

  const pdf = await Pdf.findOne({ resource: resourceId, user: userId });
  if (!pdf) throw new ApiError(404, 'No PDF found for this book');

  const isPublic = parseBool(req.body.isPublic);
  if (!req.file && isPublic === undefined) {
    throw new ApiError(400, 'Send a new "file" and/or "isPublic"');
  }

  if (req.file) {
    assertRealPdf(req.file);
    await uploadToR2(pdf.key, req.file.buffer); // same key overwrites the old file
    pdf.fileName = req.file.originalname;
    pdf.size = req.file.size;
  }
  if (isPublic !== undefined) pdf.isPublic = isPublic;

  await pdf.save();
  res.json(new ApiResponse(200, pdf, 'PDF updated'));
});

// ---------- 4. DELETE ONE ----------
export const deletePdf = asyncHandler(async (req, res) => {
  const pdf = await Pdf.findOne({ resource: req.params.resourceId, user: req.user._id });
  if (!pdf) throw new ApiError(404, 'No PDF found for this book');

  await deleteFromR2(pdf.key);
  await pdf.deleteOne();
  res.json(new ApiResponse(200, null, 'PDF deleted'));
});

// ---------- 5. GET MY PDFs ----------
export const getMyPdfs = asyncHandler(async (req, res) => {
  const pdfs = await Pdf.find({ user: req.user._id })
    .select('-key')
    .populate('resource', 'title author')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, pdfs, 'Your PDFs'));
});

// ---------- 6. DELETE ALL MY PDFs ----------
export const deleteAllMyPdfs = asyncHandler(async (req, res) => {
  const pdfs = await Pdf.find({ user: req.user._id }).select('key');
  if (!pdfs.length) {
    return res.json(new ApiResponse(200, { deleted: 0 }, 'Nothing to delete'));
  }

  await deleteManyFromR2(pdfs.map((p) => p.key));
  await Pdf.deleteMany({ user: req.user._id });

  res.json(new ApiResponse(200, { deleted: pdfs.length }, 'All your PDFs deleted'));
});

// ---------- 7. LIBRARY (public PDFs from all users) ----------
export const getLibrary = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const filter = { isPublic: true };

  const [pdfs, total] = await Promise.all([
    Pdf.find(filter)
      .select('-key')
      .populate('resource', 'title author')
      .populate('user', 'username fullname') 
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Pdf.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      { pdfs, page, limit, total, totalPages: Math.ceil(total / limit) },
      'Library'
    )
  );
});