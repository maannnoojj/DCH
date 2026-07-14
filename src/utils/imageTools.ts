import { createWorker } from 'tesseract.js';

/**
 * Loads an image File into an HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
  });
}

/**
 * 1. JPG <-> PNG <-> WEBP Format Converter
 */
export async function convertImageFormat(file: File, targetFormat: 'jpeg' | 'png' | 'webp'): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill white background if target is jpeg (since jpeg does not support transparency)
  if (targetFormat === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const mimeType = `image/${targetFormat}`;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.95));
  if (!blob) throw new Error('Image conversion failed');

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  return {
    blob,
    fileName: `${nameWithoutExt}.${ext}`,
  };
}

/**
 * 2. Image Compressor with adjustable quality
 */
export async function compressImage(file: File, quality: number): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // If compressing a PNG, we convert it to JPEG or WEBP to achieve actual compression
  const isPng = file.type === 'image/png';
  const targetType = isPng ? 'image/jpeg' : file.type;

  if (targetType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, targetType, quality));
  if (!blob) throw new Error('Image compression failed');

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const ext = targetType === 'image/jpeg' ? 'jpg' : (targetType === 'image/webp' ? 'webp' : 'png');
  return {
    blob,
    fileName: `compressed_${nameWithoutExt}.${ext}`,
  };
}

/**
 * 3. Image Resizer
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  preserveAspect: boolean = true
): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  
  let targetWidth = width;
  let targetHeight = height;

  if (preserveAspect) {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (width / height > aspect) {
      targetWidth = Math.round(height * aspect);
    } else {
      targetHeight = Math.round(width / aspect);
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type, 0.95));
  if (!blob) throw new Error('Image resize failed');

  return {
    blob,
    fileName: `resized_${file.name}`,
  };
}

/**
 * 4. Image Cropper
 */
export async function cropImage(
  file: File,
  xPct: number,
  yPct: number,
  widthPct: number,
  heightPct: number
): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');

  const x = (xPct / 100) * img.naturalWidth;
  const y = (yPct / 100) * img.naturalHeight;
  const w = (widthPct / 100) * img.naturalWidth;
  const h = (heightPct / 100) * img.naturalHeight;

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Image crop failed');

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob,
    fileName: `cropped_${nameWithoutExt}.png`,
  };
}

/**
 * 5. Simple Chroma-key / Background transparency tool (Color transparency keying)
 * Removes background pixels of a target color (default white/light grey or solid green)
 */
export async function removeBackground(
  file: File,
  targetColor: 'white' | 'green' | 'auto',
  tolerance: number = 40
): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Simple auto detect: look at corner pixel color (top-left)
  let tr = 255, tg = 255, tb = 255;
  if (targetColor === 'green') {
    tr = 0; tg = 255; tb = 0;
  } else if (targetColor === 'auto') {
    tr = data[0];
    tg = data[1];
    tb = data[2];
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      Math.pow(r - tr, 2) + 
      Math.pow(g - tg, 2) + 
      Math.pow(b - tb, 2)
    );

    // If pixel is within tolerance threshold of target color, make it transparent
    if (dist < tolerance) {
      data[i + 3] = 0; // alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Background removal failed');

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob,
    fileName: `nobg_${nameWithoutExt}.png`,
  };
}

/**
 * 6. OCR Optical Character Recognition using Tesseract.js
 */
export async function ocrImageToText(file: File, language: string = 'eng', onProgress?: (percent: number) => void): Promise<{ text: string; blob: Blob; fileName: string }> {
  const worker = await createWorker();
  
  try {
    // Note: Since tesseract worker provides granular logs, we can capture progress.
    // However, basic setup is fine!
    const imgUrl = URL.createObjectURL(file);
    const ret = await worker.recognize(imgUrl);
    URL.revokeObjectURL(imgUrl);
    
    const text = ret.data.text || 'No legible text was found in this image.';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    await worker.terminate();

    return {
      text,
      blob,
      fileName: `ocr_${nameWithoutExt}.txt`,
    };
  } catch (err) {
    await worker.terminate();
    throw err;
  }
}
