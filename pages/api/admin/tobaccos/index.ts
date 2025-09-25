import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = '1', limit = '10', search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' as const } },
            { brand: { contains: search as string, mode: 'insensitive' as const } },
            { blendType: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const orderBy = {
      [sortBy as string]: sortOrder as string,
    };

    const [tobaccos, totalCount] = await Promise.all([
      prisma.tobacco.findMany({
        where,
        include: {
          images: {
            take: 1,
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.tobacco.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      tobaccos,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching tobaccos:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
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
      isActive = true,
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

    const tobacco = await prisma.tobacco.create({
      data: tobaccoData,
      include: {
        images: true,
      },
    });

    return res.status(201).json(tobacco);
  } catch (error) {
    console.error('Error creating tobacco:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}