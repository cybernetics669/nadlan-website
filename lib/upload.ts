/**
 * File storage: Cloudflare Images (production) or local public/uploads (development).
 * Cloudflare Images is required on Netlify - local filesystem is read-only there.
 */

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

export async function saveFile(
  file: { name: string; arrayBuffer: () => Promise<ArrayBuffer> },
  _subdir: string = 'properties'
): Promise<string> {
  if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_IMAGES_API_TOKEN) {
    return saveToCloudflare(file);
  }
  return saveToLocal(file, _subdir);
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    heic: 'image/heic',
  };
  return map[ext] || 'image/jpeg';
}

async function saveToCloudflare(
  file: { name: string; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<string> {
  const formData = new FormData();
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: getMimeType(file.name) });
  formData.append('file', blob, file.name);

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('Cloudflare Images upload failed:', res.status, err);
    throw new Error(`Cloudflare upload failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    success?: boolean;
    result?: { id?: string; variants?: string[] };
  };

  if (!data.success || !data.result?.variants?.length) {
    console.error('Cloudflare Images unexpected response:', data);
    throw new Error('Cloudflare upload failed: invalid response');
  }

  // Use first variant URL (e.g. "public" or default)
  return data.result.variants[0];
}

async function saveToLocal(
  file: { name: string; arrayBuffer: () => Promise<ArrayBuffer> },
  subdir: string
): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises');
  const path = await import('path');

  const dir = path.join(process.cwd(), UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);
  const base = UPLOAD_DIR.replace(/^public\/?/, '') || 'uploads';
  return `/${base}/${subdir}/${filename}`;
}

export function getPublicUrl(relativePath: string): string {
  if (relativePath.startsWith('http')) return relativePath;
  return `${BASE_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}
