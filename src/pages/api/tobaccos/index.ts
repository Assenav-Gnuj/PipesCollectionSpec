import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    // Parse query parameters
    const {
      brand,
      blend_type,
      search,
      page = '1',
      limit = '20'
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page parameter', code: 'INVALID_PAGINATION' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Invalid limit parameter (1-100)', code: 'INVALID_PAGINATION' });
    }

    // Build cache key
    const cacheKey = `tobaccos:${JSON.stringify({ brand, blend_type, search, page: pageNum, limit: limitNum })}`;
    
    // Try to get from cache first
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (brand) {
      where.brand = brand;
    }

    if (blend_type) {
      where.blendType = blend_type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Calculate offset
    const skip = (pageNum - 1) * limitNum;

    // Get tobaccos with featured images and ratings
    const [tobaccos, totalCount] = await Promise.all([
      prisma.tobacco.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' },
      }),
      prisma.tobacco.count({ where }),
    ]);

    // Get images and ratings for the tobaccos
    const tobaccoIds = tobaccos.map(tobacco => tobacco.id);
    
    const [images, ratings] = await Promise.all([
      prisma.image.findMany({
        where: {
          itemId: { in: tobaccoIds },
          itemType: 'tobacco',
          isFeatured: true,
        },
      }),
      prisma.rating.findMany({
        where: {
          itemId: { in: tobaccoIds },
          itemType: 'tobacco',
        },
      }),
    ]);

    // Create maps for efficient lookup
    const imageMap = new Map(images.map(img => [img.itemId, img]));
    const ratingMap = new Map<string, { sum: number; count: number }>();

    ratings.forEach(rating => {
      const existing = ratingMap.get(rating.itemId) || { sum: 0, count: 0 };
      existing.sum += rating.rating;
      existing.count += 1;
      ratingMap.set(rating.itemId, existing);
    });

    // Get filter options
    const [brands, blendTypes] = await Promise.all([
      prisma.tobacco.groupBy({
        by: ['brand'],
        where: { isActive: true },
        orderBy: { brand: 'asc' },
      }),
      prisma.tobacco.groupBy({
        by: ['blendType'],
        where: { isActive: true },
        orderBy: { blendType: 'asc' },
      }),
    ]);

    // Format response
    const data = tobaccos.map(tobacco => {
      const featuredImage = imageMap.get(tobacco.id);
      const ratingData = ratingMap.get(tobacco.id);
      
      return {
        id: tobacco.id,
        name: tobacco.name,
        brand: tobacco.brand,
        blend_type: tobacco.blendType,
        featured_image: featuredImage ? {
          id: featuredImage.id,
          filename: featuredImage.filename,
          alt_text: featuredImage.altText,
        } : null,
        strength: tobacco.strength,
        room_note: tobacco.roomNote,
        taste: tobacco.taste,
        average_rating: ratingData ? Number((ratingData.sum / ratingData.count).toFixed(1)) : 0,
        rating_count: ratingData?.count || 0,
      };
    });

    const response = {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
      },
      filters: {
        brands: brands.map(b => b.brand),
        blend_types: blendTypes.map(bt => bt.blendType),
      },
    };

    // Cache the result for 5 minutes
    await cache.set(cacheKey, response, 300);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tobaccos:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}