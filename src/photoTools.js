// Getting a guest's photo ready: shrink sensibly (keeping good quality) and read faces.

export const MAX_SIDE = 2800;      // long edge in pixels — still sharp for viewing and printing small
export const JPEG_QUALITY = 0.9;
const KEEP_ORIGINAL_UNDER = 2.2 * 1024 * 1024;

async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* try the fallback */ }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unsupported')); };
    img.src = url;
  });
}

function drawScaled(source, maxSide) {
  const w = source.width || source.naturalWidth;
  const h = source.height || source.naturalHeight;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return { canvas, w, h };
}

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
  reader.onerror = () => reject(new Error('read failed'));
  reader.readAsDataURL(blob);
});

// -> { base64, mime, faceCanvas }
export async function prepareForUpload(file) {
  const source = await decode(file);
  const { canvas: big, w, h } = drawScaled(source, MAX_SIDE);
  if (source.close) source.close();

  let blob;
  let mime = 'image/jpeg';
  const isJpeg = file.type === 'image/jpeg';
  if (isJpeg && file.size <= KEEP_ORIGINAL_UNDER && Math.max(w, h) <= MAX_SIDE) {
    blob = file;                              // already small: upload the untouched original
  } else {
    blob = await toBlob(big, 'image/jpeg', JPEG_QUALITY);
    if (!blob) throw new Error('could not prepare photo');
  }
  const base64 = await blobToBase64(blob);

  // copy used for reading faces (kept large so small faces in group photos still work)
  const faceCanvas = document.createElement('canvas');
  const fs = Math.min(1, 1600 / Math.max(big.width, big.height));
  faceCanvas.width = Math.round(big.width * fs);
  faceCanvas.height = Math.round(big.height * fs);
  faceCanvas.getContext('2d').drawImage(big, 0, 0, faceCanvas.width, faceCanvas.height);
  return { base64, mime, faceCanvas };
}

// Small canvas for a selfie
export async function selfieCanvas(file) {
  const source = await decode(file);
  const { canvas } = drawScaled(source, 1600);
  if (source.close) source.close();
  return canvas;
}
