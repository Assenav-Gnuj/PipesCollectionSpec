import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid accessory ID' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, id);
    case 'PUT':
      return handlePut(req, res, id);
    case 'DELETE':
      return handleDelete(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const accessory = await prisma.accessory.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }

    return res.status(200).json(accessory);
  } catch (error) {
    console.error('Error fetching accessory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const {
      name,
      brand,
      category,
      description,
      observations,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !category || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, category, description' 
      });
    }

    const accessoryData = {
      name: name.trim(),
      brand: brand?.trim() || null,
      category: category.trim(),
      description: description.trim(),
      observations: observations?.trim() || null,
      isActive: Boolean(isActive),
    };

    const accessory = await prisma.accessory.update({
      where: { id },
      data: accessoryData,
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return res.status(200).json(accessory);
  } catch (error) {
    console.error('Error updating accessory:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // First, delete associated images
    await prisma.image.deleteMany({
      where: {
        itemId: id,
        itemType: 'accessory',
      },
    });

    // Then delete the accessory
    await prisma.accessory.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    console.error('Error deleting accessory:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}