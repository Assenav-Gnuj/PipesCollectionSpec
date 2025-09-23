import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      page = '1',
      limit = '12',
      brands = '',
      categories = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Parse filters
    const brandFilters = brands ? (brands as string).split(',').filter(Boolean) : [];
    const categoryFilters = categories ? (categories as string).split(',').filter(Boolean) : [];

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (brandFilters.length > 0) {
      where.brand = { in: brandFilters };
    }

    if (categoryFilters.length > 0) {
      where.category = { in: categoryFilters };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Fetch accessories and total count
    const [accessories, totalCount] = await Promise.all([
      prisma.accessory.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.accessory.count({ where }),
    ]);

    // Get ratings and images for the found accessories
    const accessoryIds = accessories.map(accessory => accessory.id);
    
    const [ratings, images] = await Promise.all([
      prisma.rating.findMany({
        where: {
          itemId: { in: accessoryIds },
          itemType: 'accessory',
        },
        select: {
          itemId: true,
          rating: true,
        },
      }),
      prisma.image.findMany({
        where: {
          itemId: { in: accessoryIds },
          itemType: 'accessory',
          isFeatured: true,
        },
        select: {
          itemId: true,
          filename: true,
        },
      }),
    ]);

    // Transform data to match expected format
    const transformedAccessories = accessories.map((accessory) => {
      const accessoryRatings = ratings.filter(r => r.itemId === accessory.id);
      const accessoryImage = images.find(img => img.itemId === accessory.id);
      
      return {
        id: accessory.id,
        name: accessory.name,
        manufacturer: accessory.brand,
        images: accessoryImage ? [`/api/images/${accessoryImage.filename}`] : [],
        description: accessory.description,
        averageRating: accessoryRatings.length > 0 
          ? accessoryRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / accessoryRatings.length 
          : 0,
        totalRatings: accessoryRatings.length,
        category: accessory.category,
      };
    });

    res.status(200).json({
      accessories: transformedAccessories,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPreviousPage: pageNum > 1,
    });
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}