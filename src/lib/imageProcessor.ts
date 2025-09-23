import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface ProcessedImageResult {
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  path: string;
}

/**
 * Process and optimize uploaded image
 */
export async function processImage(
  inputPath: string,
  outputDir: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const {
    width = 1200,
    height = 800,
    quality = 85,
    format = 'webp',
    fit = 'cover'
  } = options;

  const inputBuffer = fs.readFileSync(inputPath);
  const originalMetadata = await sharp(inputBuffer).metadata();
  
  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const outputFilename = `processed-${uniqueSuffix}.${format}`;
  const outputPath = path.join(outputDir, outputFilename);

  // Process image with Sharp
  const processedBuffer = await sharp(inputBuffer)
    .resize(width, height, { fit })
    .toFormat(format, { 
      quality,
      progressive: true,
      mozjpeg: format === 'jpeg'
    })
    .toBuffer();

  // Write processed image
  fs.writeFileSync(outputPath, processedBuffer);

  // Get processed image metadata
  const processedMetadata = await sharp(processedBuffer).metadata();

  // Clean up original file
  fs.unlinkSync(inputPath);

  return {
    filename: outputFilename,
    originalName: path.basename(inputPath),
    fileSize: processedBuffer.length,
    mimeType: `image/${format}`,
    width: processedMetadata.width || width,
    height: processedMetadata.height || height,
    path: outputPath,
  };
}

/**
 * Generate thumbnail for an image
 */
export async function generateThumbnail(
  inputPath: string,
  outputDir: string,
  size: number = 300
): Promise<ProcessedImageResult> {
  return processImage(inputPath, outputDir, {
    width: size,
    height: size,
    format: 'webp',
    quality: 80,
    fit: 'cover'
  });
}

/**
 * Create multiple sizes for responsive images
 */
export async function createResponsiveImages(
  inputPath: string,
  outputDir: string
): Promise<{
  original: ProcessedImageResult;
  large: ProcessedImageResult;
  medium: ProcessedImageResult;
  small: ProcessedImageResult;
  thumbnail: ProcessedImageResult;
}> {
  const inputBuffer = fs.readFileSync(inputPath);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

  const sizes = {
    original: { width: 1920, height: 1280, quality: 90 },
    large: { width: 1200, height: 800, quality: 85 },
    medium: { width: 800, height: 600, quality: 80 },
    small: { width: 400, height: 300, quality: 75 },
    thumbnail: { width: 200, height: 200, quality: 70 },
  };

  const results: any = {};

  for (const [sizeName, sizeConfig] of Object.entries(sizes)) {
    const filename = `${sizeName}-${uniqueSuffix}.webp`;
    const outputPath = path.join(outputDir, filename);

    const processedBuffer = await sharp(inputBuffer)
      .resize(sizeConfig.width, sizeConfig.height, { fit: 'cover' })
      .toFormat('webp', { 
        quality: sizeConfig.quality,
        progressive: true
      })
      .toBuffer();

    fs.writeFileSync(outputPath, processedBuffer);

    const metadata = await sharp(processedBuffer).metadata();

    results[sizeName] = {
      filename,
      originalName: path.basename(inputPath),
      fileSize: processedBuffer.length,
      mimeType: 'image/webp',
      width: metadata.width || sizeConfig.width,
      height: metadata.height || sizeConfig.height,
      path: outputPath,
    };
  }

  // Clean up original file
  fs.unlinkSync(inputPath);

  return results;
}