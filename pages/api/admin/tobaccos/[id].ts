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
    return res.status(400).json({ message: 'Invalid tobacco ID' });
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
    const tobacco = await prisma.tobacco.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!tobacco) {
      return res.status(404).json({ message: 'Tobacco not found' });
    }

    return res.status(200).json(tobacco);
  } catch (error) {
    console.error('Error fetching tobacco:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const {
      name,
      brand,
      blendType,
      contents,
      cut,
      strength,
      roomNote,
      taste,
      observations,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !brand || !blendType || !contents || !cut || 
        typeof strength !== 'number' || typeof roomNote !== 'number' || typeof taste !== 'number') {
      return res.status(400).json({ 
        message: 'Missing required fields: name, brand, blendType, contents, cut, strength, roomNote, taste' 
      });
    }

    // Validate rating ranges
    if (strength < 1 || strength > 7) {
      return res.status(400).json({ message: 'Strength must be between 1 and 7' });
    }

    if (roomNote < 1 || roomNote > 10 || taste < 1 || taste > 10) {
      return res.status(400).json({ message: 'RoomNote and taste must be between 1 and 10' });
    }

    const tobaccoData = {
      name: name.trim(),
      brand: brand.trim(),
      blendType: blendType.trim(),
      contents: contents.trim(),
      cut: cut.trim(),
      strength: Number(strength),
      roomNote: Number(roomNote),
      taste: Number(taste),
      observations: observations?.trim() || null,
      isActive: Boolean(isActive),
    };

    const tobacco = await prisma.tobacco.update({
      where: { id },
      data: tobaccoData,
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return res.status(200).json(tobacco);
  } catch (error) {
    console.error('Error updating tobacco:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Tobacco not found' });
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
        itemType: 'tobacco',
      },
    });

    // Then delete the tobacco
    await prisma.tobacco.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Tobacco deleted successfully' });
  } catch (error) {
    console.error('Error deleting tobacco:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Tobacco not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}