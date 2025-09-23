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
            { category: { contains: search as string, mode: 'insensitive' as const } },
            { description: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const orderBy = {
      [sortBy as string]: sortOrder as string,
    };

    const [accessories, totalCount] = await Promise.all([
      prisma.accessory.findMany({
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
      prisma.accessory.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      accessories,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      name,
      brand,
      category,
      description,
      observations,
      isActive = true,
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

    const accessory = await prisma.accessory.create({
      data: accessoryData,
      include: {
        images: true,
      },
    });

    return res.status(201).json(accessory);
  } catch (error) {
    console.error('Error creating accessory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}