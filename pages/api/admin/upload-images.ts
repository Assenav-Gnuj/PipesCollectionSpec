import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { processImage } from '@/lib/imageProcessor';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Parse the form data
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 10,
      filter: (part: any) => {
        return part.mimetype?.startsWith('image/') || false;
      },
    });

    const [fields, files] = await form.parse(req);

    const itemId = Array.isArray(fields.itemId) ? fields.itemId[0] : fields.itemId;
    const itemType = Array.isArray(fields.itemType) ? fields.itemType[0] : fields.itemType;
    const altText = Array.isArray(fields.altText) ? fields.altText[0] : fields.altText;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: 'itemId and itemType are required' });
    }

    // Validate itemType
    const validItemTypes = ['pipe', 'tobacco', 'accessory'];
    if (!validItemTypes.includes(itemType as string)) {
      return res.status(400).json({ message: 'Invalid itemType' });
    }

    // Verify that the item exists
    let item;
    switch (itemType) {
      case 'pipe':
        item = await prisma.pipe.findUnique({ where: { id: itemId as string } });
        break;
      case 'tobacco':
        item = await prisma.tobacco.findUnique({ where: { id: itemId as string } });
        break;
      case 'accessory':
        item = await prisma.accessory.findUnique({ where: { id: itemId as string } });
        break;
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const processedImages = [];

    for (const file of uploadedFiles) {
      if (!file || !file.filepath) continue;

      try {
        // Process and optimize the image
        const processedImage = await processImage(
          file.filepath,
          './public/uploads',
          {
            width: 1200,
            height: 800,
            quality: 85,
            format: 'webp'
          }
        );

        // Get the highest sort order for this item
        const maxSortOrder = await prisma.image.aggregate({
          where: {
            itemId: itemId as string,
            itemType: itemType as any,
          },
          _max: {
            sortOrder: true,
          },
        });

        const sortOrder = (maxSortOrder._max.sortOrder || 0) + 1;

        // Save to database
        const savedImage = await prisma.image.create({
          data: {
            itemId: itemId as string,
            itemType: itemType as any,
            filename: processedImage.filename,
            originalName: file.originalFilename || processedImage.filename,
            fileSize: processedImage.fileSize,
            mimeType: processedImage.mimeType,
            width: processedImage.width,
            height: processedImage.height,
            altText: (altText as string) || file.originalFilename || '',
            sortOrder,
          },
        });

        processedImages.push({
          id: savedImage.id,
          filename: savedImage.filename,
          originalName: savedImage.originalName,
          url: `/uploads/${savedImage.filename}`,
          width: savedImage.width,
          height: savedImage.height,
          fileSize: savedImage.fileSize,
          sortOrder: savedImage.sortOrder,
        });

      } catch (error) {
        console.error('Error processing image:', error);
        // Clean up the original file if processing failed
        try {
          if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
    }

    if (processedImages.length === 0) {
      return res.status(500).json({ message: 'Failed to process any images' });
    }

    return res.status(200).json({
      message: `Successfully uploaded ${processedImages.length} image(s)`,
      images: processedImages,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}