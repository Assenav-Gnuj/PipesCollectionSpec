import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { q, type, page = '1', limit = '20' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters', code: 'INVALID_QUERY' });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page parameter', code: 'INVALID_PAGINATION' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Invalid limit parameter (1-100)', code: 'INVALID_PAGINATION' });
    }

    const searchTerm = q.trim();
    const cacheKey = `search:${JSON.stringify({ q: searchTerm, type, page: pageNum, limit: limitNum })}`;

    // Try to get from cache first
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    const searchTypes = type ? [type] : ['pipes', 'tobaccos', 'accessories'];
    const results: any = {
      query: searchTerm,
      results: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        pages: 0,
      },
    };

    // Calculate skip for pagination
    const skip = (pageNum - 1) * limitNum;

    // Search in each type
    const searchPromises = [];

    if (searchTypes.includes('pipes')) {
      searchPromises.push(
        prisma.pipe.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { brand: { contains: searchTerm, mode: 'insensitive' } },
              { country: { contains: searchTerm, mode: 'insensitive' } },
              { material: { contains: searchTerm, mode: 'insensitive' } },
              { shape: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          skip: type === 'pipes' ? skip : 0,
          take: type === 'pipes' ? limitNum : limitNum / 3,
          orderBy: { name: 'asc' },
        })
      );
    }

    if (searchTypes.includes('tobaccos')) {
      searchPromises.push(
        prisma.tobacco.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { brand: { contains: searchTerm, mode: 'insensitive' } },
              { blendType: { contains: searchTerm, mode: 'insensitive' } },
              { contents: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          skip: type === 'tobaccos' ? skip : 0,
          take: type === 'tobaccos' ? limitNum : limitNum / 3,
          orderBy: { name: 'asc' },
        })
      );
    }

    if (searchTypes.includes('accessories')) {
      searchPromises.push(
        prisma.accessory.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { brand: { contains: searchTerm, mode: 'insensitive' } },
              { category: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          skip: type === 'accessories' ? skip : 0,
          take: type === 'accessories' ? limitNum : limitNum / 3,
          orderBy: { name: 'asc' },
        })
      );
    }

    const searchResults = await Promise.all(searchPromises);
    let allItems: any[] = [];

    // Process pipes
    if (searchTypes.includes('pipes') && searchResults[0]) {
      const pipes = searchResults[0] as any[];
      const pipeItems = pipes.map(pipe => ({
        type: 'pipe',
        id: pipe.id,
        name: pipe.name,
        brand: pipe.brand,
        country: pipe.country,
        material: pipe.material,
        shape: pipe.shape,
        url: `/pipes/${pipe.id}`,
      }));
      allItems = allItems.concat(pipeItems);
    }

    // Process tobaccos
    if (searchTypes.includes('tobaccos') && searchResults[searchTypes.includes('pipes') ? 1 : 0]) {
      const tobaccos = searchResults[searchTypes.includes('pipes') ? 1 : 0] as any[];
      const tobaccoItems = tobaccos.map(tobacco => ({
        type: 'tobacco',
        id: tobacco.id,
        name: tobacco.name,
        brand: tobacco.brand,
        blend_type: tobacco.blendType,
        strength: tobacco.strength,
        url: `/tobaccos/${tobacco.id}`,
      }));
      allItems = allItems.concat(tobaccoItems);
    }

    // Process accessories
    if (searchTypes.includes('accessories') && searchResults[searchResults.length - 1]) {
      const accessories = searchResults[searchResults.length - 1] as any[];
      const accessoryItems = accessories.map(accessory => ({
        type: 'accessory',
        id: accessory.id,
        name: accessory.name,
        brand: accessory.brand,
        category: accessory.category,
        url: `/accessories/${accessory.id}`,
      }));
      allItems = allItems.concat(accessoryItems);
    }

    results.results = allItems;
    results.pagination.total = allItems.length;
    results.pagination.pages = Math.ceil(allItems.length / limitNum);

    // Cache the result for 5 minutes
    await cache.set(cacheKey, results, 300);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}