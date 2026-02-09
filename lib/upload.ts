/**
 * File storage abstraction: local dev uploads to public/uploads.
 * Later: switch to S3/R2 by implementing saveFile + getPublicUrl.
 */

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function saveFile(
  file: { name: string; arrayBuffer: () => Promise<ArrayBuffer> },
  subdir: string = 'properties'
): Promise<string> {
  const dir = path.join(process.cwd(), UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);
  // Serve from /uploads/... (public/uploads -> /uploads)
  const base = UPLOAD_DIR.replace(/^public\/?/, '') || 'uploads';
  return `/${base}/${subdir}/${filename}`;
}

export function getPublicUrl(relativePath: string): string {
  if (relativePath.startsWith('http')) return relativePath;
  return `${BASE_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}
