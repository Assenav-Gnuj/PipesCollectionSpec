import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  switch (req.method) {
    case 'DELETE':
      return handleDelete(req, res, id);
    default:
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // Get image details before deletion
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join('./public/uploads', image.filename);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    // Reorder remaining images to close gaps
    const remainingImages = await prisma.image.findMany({
      where: {
        itemId: image.itemId,
        itemType: image.itemType,
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Update sort orders
    await Promise.all(
      remainingImages.map((img, index) =>
        prisma.image.update({
          where: { id: img.id },
          data: { sortOrder: index + 1 },
        })
      )
    );

    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}