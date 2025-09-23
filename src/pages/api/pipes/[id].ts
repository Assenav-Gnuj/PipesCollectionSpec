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
      return res.status(400).json({ error: 'Invalid pipe ID', code: 'INVALID_ID' });
    }

    // Try to get from cache first
    const cacheKey = `pipe:${id}`;
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Get pipe with all related data
    const pipe = await prisma.pipe.findUnique({
      where: { id },
    });

    if (!pipe || !pipe.isActive) {
      return res.status(404).json({ error: 'Pipe not found', code: 'PIPE_NOT_FOUND' });
    }

    // Get images and ratings for the pipe
    const [images, ratings] = await Promise.all([
      prisma.image.findMany({
        where: {
          itemId: id,
          itemType: 'pipe',
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'asc' },
        ],
      }),
      prisma.rating.findMany({
        where: {
          itemId: id,
          itemType: 'pipe',
        },
      }),
    ]);

    // Calculate average rating
    const ratingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = ratings.length > 0 ? Number((ratingSum / ratings.length).toFixed(1)) : 0;

    // Format response
    const response = {
      id: pipe.id,
      name: pipe.name,
      brand: pipe.brand,
      country: pipe.country,
      material: pipe.material,
      shape: pipe.shape,
      finish: pipe.finish,
      filter_type: pipe.filterType,
      stem_material: pipe.stemMaterial,
      observations: pipe.observations,
      images: images.map(image => ({
        id: image.id,
        filename: image.filename,
        alt_text: image.altText,
        is_featured: image.isFeatured,
        sort_order: image.sortOrder,
      })),
      average_rating: averageRating,
      rating_count: ratings.length,
      created_at: pipe.createdAt.toISOString(),
    };

    // Cache the result for 10 minutes
    await cache.set(cacheKey, response, 600);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching pipe:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}