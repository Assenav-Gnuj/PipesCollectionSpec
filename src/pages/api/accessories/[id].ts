import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid accessory ID', code: 'INVALID_ID' });
    }

    // Try to get from cache first
    const cacheKey = `accessory:${id}`;
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Get accessory with all related data
    const accessory = await prisma.accessory.findUnique({
      where: { id },
    });

    if (!accessory || !accessory.isActive) {
      return res.status(404).json({ error: 'Accessory not found', code: 'ACCESSORY_NOT_FOUND' });
    }

    // Get images and ratings for the accessory
    const [images, ratings] = await Promise.all([
      prisma.image.findMany({
        where: {
          itemId: id,
          itemType: 'accessory',
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'asc' },
        ],
      }),
      prisma.rating.findMany({
        where: {
          itemId: id,
          itemType: 'accessory',
        },
      }),
    ]);

    // Calculate average rating
    const ratingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = ratings.length > 0 ? Number((ratingSum / ratings.length).toFixed(1)) : 0;

    // Format response
    const response = {
      id: accessory.id,
      name: accessory.name,
      brand: accessory.brand,
      category: accessory.category,
      description: accessory.description,
      observations: accessory.observations,
      images: images.map(image => ({
        id: image.id,
        filename: image.filename,
        alt_text: image.altText,
        is_featured: image.isFeatured,
        sort_order: image.sortOrder,
      })),
      average_rating: averageRating,
      rating_count: ratings.length,
      created_at: accessory.createdAt.toISOString(),
    };

    // Cache the result for 10 minutes
    await cache.set(cacheKey, response, 600);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching accessory:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}