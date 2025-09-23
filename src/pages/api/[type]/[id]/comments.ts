import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetComments(req, res);
  } else if (req.method === 'POST') {
    return handlePostComment(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }
}

async function handleGetComments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id } = req.query;
    const { page = '1', limit = '10' } = req.query;

    // Validate parameters
    if (!type || !id || typeof type !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid type or ID', code: 'INVALID_PARAMS' });
    }

    if (!['pipes', 'tobaccos', 'accessories'].includes(type)) {
      return res.status(400).json({ error: 'Invalid item type', code: 'INVALID_TYPE' });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page parameter', code: 'INVALID_PAGINATION' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Invalid limit parameter (1-50)', code: 'INVALID_PAGINATION' });
    }

    // Convert type to singular for database
    const itemType = type.slice(0, -1);

    // Try to get from cache first
    const cacheKey = `comments:${itemType}:${id}:${pageNum}:${limitNum}`;
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

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

    const skip = (pageNum - 1) * limitNum;

    // Get approved comments only
    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where: {
          itemId: id,
          itemType: itemType as any,
          isApproved: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.comment.count({
        where: {
          itemId: id,
          itemType: itemType as any,
          isApproved: true,
        },
      }),
    ]);

    const response = {
      data: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author_name: comment.authorName,
        created_at: comment.createdAt.toISOString(),
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
      },
    };

    // Cache the result for 5 minutes
    await cache.set(cacheKey, response, 300);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}

async function handlePostComment(req: NextApiRequest, res: NextApiResponse) {

async function handlePostComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id } = req.query;
    const { content, authorName, sessionId } = req.body;

    // Validate parameters
    if (!type || !id || typeof type !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid type or ID', code: 'INVALID_PARAMS' });
    }

    if (!['pipes', 'tobaccos', 'accessories'].includes(type)) {
      return res.status(400).json({ error: 'Invalid item type', code: 'INVALID_TYPE' });
    }

    if (!content || !sessionId || typeof content !== 'string' || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Content and sessionId are required', code: 'MISSING_PARAMS' });
    }

    if (content.trim().length < 1 || content.length > 2000) {
      return res.status(400).json({ error: 'Content must be between 1 and 2000 characters', code: 'INVALID_CONTENT_LENGTH' });
    }

    if (authorName && (typeof authorName !== 'string' || authorName.length > 100)) {
      return res.status(400).json({ error: 'Author name must be max 100 characters', code: 'INVALID_AUTHOR_NAME' });
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

    // Basic profanity filter (simple word list - in production would use more sophisticated filtering)
    const profanityWords = ['spam', 'fake', 'scam']; // Add more as needed
    const containsProfanity = profanityWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );

    if (containsProfanity) {
      return res.status(400).json({ error: 'Comment contains inappropriate content', code: 'INAPPROPRIATE_CONTENT' });
    }

    // Get client IP for moderation purposes
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // Create comment (requires moderation by default)
    const comment = await prisma.comment.create({
      data: {
        itemId: id,
        itemType: itemType as any,
        content: content.trim(),
        authorName: authorName?.trim() || null,
        sessionId,
        isApproved: false, // Comments require approval
        ipAddress: clientIP as string,
      },
    });

    // Invalidate cache for comments
    await cache.invalidatePattern(`comments:${itemType}:${id}:*`);

    res.status(201).json({
      message: 'Comment submitted successfully and is pending moderation',
      comment: {
        id: comment.id,
        content: comment.content,
        author_name: comment.authorName,
        created_at: comment.createdAt.toISOString(),
        is_approved: comment.isApproved,
      },
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}