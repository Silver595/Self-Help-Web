import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, R2_BUCKET } from '../config/r2.config.js';
import { DOWNLOAD_LINK_EXPIRY } from '../constanst.js';


// R2 deletes max 1000 files per request, so we split into chunks
const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const uploadToR2 = (key, buffer) =>
  r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    })
  );

export const deleteFromR2 = (key) =>
  r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));

// R2 deletes max 1000 files per request, so we go in chunks
export const deleteManyFromR2 = async (keys) => {
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: R2_BUCKET,
        Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
      })
    );
  }
};

// Temporary "visitor pass" download link
export const getDownloadUrl = (key, fileName) => {
  const safeName = fileName.replace(/[^\w.\- ]/g, '_');
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${safeName}"`,
    }),
    { expiresIn: DOWNLOAD_LINK_EXPIRY }
  );
};