import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

import sharp from "sharp";

const STORAGE_ROOT = process.env.STORAGE_ROOT ?? path.join(process.cwd(), "storage");
const UPLOADS_DIR = path.join(STORAGE_ROOT, "uploads");
const THUMBS_DIR = path.join(STORAGE_ROOT, "thumbs");

function extFromName(filename?: string) {
  const ext = path.extname(filename ?? "").replace(".", "").toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)) {
    return ext;
  }
  return "jpg";
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function ensureStorageDirs() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(THUMBS_DIR, { recursive: true });
}

export async function saveImageAndThumb(file: File) {
  await ensureStorageDirs();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromName(file.name);

  const baseName = `${Date.now()}-${crypto.randomUUID()}`;
  const sourceFilename = sanitizeFilename(`${baseName}.${ext}`);
  const thumbFilename = sanitizeFilename(`${baseName}.jpg`);

  const sourcePath = path.join(UPLOADS_DIR, sourceFilename);
  const thumbPath = path.join(THUMBS_DIR, thumbFilename);

  await fs.writeFile(sourcePath, buffer);

  await sharp(buffer)
    .rotate()
    .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toFile(thumbPath);

  return {
    sourceFilename,
    thumbFilename,
    imageUrl: `/api/files/upload/${sourceFilename}`,
    thumbUrl: `/api/files/thumb/${thumbFilename}`,
  };
}

export async function readStoredFile(kind: "upload" | "thumb", filename: string) {
  const safeName = sanitizeFilename(filename);
  if (!safeName || safeName !== filename) {
    return null;
  }

  const targetDir = kind === "upload" ? UPLOADS_DIR : THUMBS_DIR;
  const absolutePath = path.join(targetDir, safeName);

  try {
    const content = await fs.readFile(absolutePath);
    return content;
  } catch {
    return null;
  }
}

export async function removeStoredFileByUrl(url?: string | null) {
  if (!url) {
    return;
  }

  const filename = url.split("/").pop();
  if (!filename) {
    return;
  }

  const isThumb = url.includes("/thumb/");
  const targetDir = isThumb ? THUMBS_DIR : UPLOADS_DIR;

  try {
    await fs.unlink(path.join(targetDir, sanitizeFilename(filename)));
  } catch {
    // ignore if file doesn't exist
  }
}

export function contentTypeFromFilename(filename: string) {
  const ext = path.extname(filename).replace(".", "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}
