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
    return res.status(400).json({ message: 'Invalid pipe ID' });
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
    const pipe = await prisma.pipe.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!pipe) {
      return res.status(404).json({ message: 'Pipe not found' });
    }

    return res.status(200).json(pipe);
  } catch (error) {
    console.error('Error fetching pipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const {
      name,
      brand,
      model,
      material,
      shape,
      finish,
      filterType,
      stemMaterial,
      year,
      country,
      observations,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !brand || !material || !shape || !finish || !filterType || !stemMaterial) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, brand, material, shape, finish, filterType, stemMaterial' 
      });
    }

    const pipeData = {
      name: name.trim(),
      brand: brand.trim(),
      model: model?.trim() || '',
      material: material.trim(),
      shape: shape.trim(),
      finish: finish.trim(),
      filterType: filterType.trim(),
      stemMaterial: stemMaterial.trim(),
      year: year ? parseInt(year) : null,
      country: country?.trim() || '',
      observations: observations?.trim() || null,
      isActive: Boolean(isActive),
    };

    const pipe = await prisma.pipe.update({
      where: { id },
      data: pipeData,
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return res.status(200).json(pipe);
  } catch (error) {
    console.error('Error updating pipe:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Pipe not found' });
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
        itemType: 'pipe',
      },
    });

    // Then delete the pipe
    await prisma.pipe.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Pipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting pipe:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Pipe not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}