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
      return res.status(400).json({ error: 'Invalid tobacco ID', code: 'INVALID_ID' });
    }

    // Try to get from cache first
    const cacheKey = `tobacco:${id}`;
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Get tobacco with all related data
    const tobacco = await prisma.tobacco.findUnique({
      where: { id },
    });

    if (!tobacco || !tobacco.isActive) {
      return res.status(404).json({ error: 'Tobacco not found', code: 'TOBACCO_NOT_FOUND' });
    }

    // Get images and ratings for the tobacco
    const [images, ratings] = await Promise.all([
      prisma.image.findMany({
        where: {
          itemId: id,
          itemType: 'tobacco',
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'asc' },
        ],
      }),
      prisma.rating.findMany({
        where: {
          itemId: id,
          itemType: 'tobacco',
        },
      }),
    ]);

    // Calculate average rating
    const ratingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = ratings.length > 0 ? Number((ratingSum / ratings.length).toFixed(1)) : 0;

    // Format response
    const response = {
      id: tobacco.id,
      name: tobacco.name,
      brand: tobacco.brand,
      blend_type: tobacco.blendType,
      contents: tobacco.contents,
      cut: tobacco.cut,
      strength: tobacco.strength,
      room_note: tobacco.roomNote,
      taste: tobacco.taste,
      observations: tobacco.observations,
      images: images.map(image => ({
        id: image.id,
        filename: image.filename,
        alt_text: image.altText,
        is_featured: image.isFeatured,
        sort_order: image.sortOrder,
      })),
      average_rating: averageRating,
      rating_count: ratings.length,
      created_at: tobacco.createdAt.toISOString(),
    };

    // Cache the result for 10 minutes
    await cache.set(cacheKey, response, 600);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tobacco:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}