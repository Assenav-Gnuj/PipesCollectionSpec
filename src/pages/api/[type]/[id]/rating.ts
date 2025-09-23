import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { type, id } = req.query;
    const { rating, sessionId } = req.body;

    // Validate parameters
    if (!type || !id || typeof type !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid type or ID', code: 'INVALID_PARAMS' });
    }

    if (!['pipes', 'tobaccos', 'accessories'].includes(type)) {
      return res.status(400).json({ error: 'Invalid item type', code: 'INVALID_TYPE' });
    }

    if (!rating || !sessionId || typeof rating !== 'number' || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Rating and sessionId are required', code: 'MISSING_PARAMS' });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5', code: 'INVALID_RATING' });
    }

    // Convert type to singular for database
    const itemType = type.slice(0, -1); // removes 's' from end (pipes -> pipe)

    // Verify the item exists and is active
    let itemExists = false;
    if (itemType === 'pipe') {
      const pipe = await prisma.pipe.findUnique({ where: { id, isActive: true } });
      itemExists = !!pipe;
    } else if (itemType === 'tobacco') {
      const tobacco = await prisma.tobacco.findUnique({ where: { id, isActive: true } });
      itemExists = !!tobacco;
    } else if (itemType === 'accessory') {
      const accessory = await prisma.accessory.findUnique({ where: { id, isActive: true } });
      itemExists = !!accessory;
    }

    if (!itemExists) {
      return res.status(404).json({ error: 'Item not found', code: 'ITEM_NOT_FOUND' });
    }

    // Get client IP for rate limiting (optional)
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    try {
      // Create or update rating
      const existingRating = await prisma.rating.findFirst({
        where: {
          itemId: id,
          itemType: itemType as any,
          sessionId,
        },
      });

      let ratingRecord;
      if (existingRating) {
        // Update existing rating
        ratingRecord = await prisma.rating.update({
          where: { id: existingRating.id },
          data: {
            rating,
            ipAddress: clientIP as string,
          },
        });
      } else {
        // Create new rating
        ratingRecord = await prisma.rating.create({
          data: {
            itemId: id,
            itemType: itemType as any,
            sessionId,
            rating,
            ipAddress: clientIP as string,
          },
        });
      }

      // Invalidate cache for this item
      await cache.del(`${itemType}:${id}`);
      await cache.invalidatePattern(`${type}:*`);

      // Calculate new average rating
      const allRatings = await prisma.rating.findMany({
        where: {
          itemId: id,
          itemType: itemType as any,
        },
      });

      const averageRating = allRatings.length > 0 
        ? Number((allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1))
        : 0;

      res.status(200).json({
        message: existingRating ? 'Rating updated successfully' : 'Rating created successfully',
        rating: {
          id: ratingRecord.id,
          rating: ratingRecord.rating,
          created_at: ratingRecord.createdAt.toISOString(),
        },
        average_rating: averageRating,
        rating_count: allRatings.length,
      });

    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Rating already exists for this session', code: 'DUPLICATE_RATING' });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}