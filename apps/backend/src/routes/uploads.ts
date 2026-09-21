import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Router } from 'express';
import multer from 'multer';

import { env } from '../lib/env.js';
import { requireAuth } from '../middleware/auth.js';

// Local-disk storage — a dev/demo stand-in, not production infrastructure.
// CLAUDE.md doesn't specify object storage (S3-equivalent) anywhere, and it's
// out of scope to stand one up here; this at least makes kahve falı photo
// upload and post images actually work end-to-end for testing.
export const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${randomBytes(16).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are accepted'));
      return;
    }
    cb(null, true);
  },
});

export const uploadsRouter = Router();

uploadsRouter.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded (expected multipart field "file")' });
    return;
  }
  res.status(201).json({ url: `${env.publicUrl}/uploads/${req.file.filename}` });
});
