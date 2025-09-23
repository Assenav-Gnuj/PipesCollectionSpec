import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      q = '',
      page = '1',
      limit = '12',
      types = '',
      brands = '',
      categories = '',
      sortBy = 'relevance',
      sortOrder = 'desc',
    } = req.query;

    const query = q as string;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    if (!query.trim()) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Parse filters
    const typeFilters = types ? (types as string).split(',').filter(Boolean) : [];
    const brandFilters = brands ? (brands as string).split(',').filter(Boolean) : [];
    const categoryFilters = categories ? (categories as string).split(',').filter(Boolean) : [];

    let allResults: any[] = [];
    let suggestions: string[] = [];

    // Search in pipes if no type filter or includes 'pipe'
    if (typeFilters.length === 0 || typeFilters.includes('pipe')) {
      const pipeWhere: any = {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { material: { contains: query, mode: 'insensitive' } },
          { shape: { contains: query, mode: 'insensitive' } },
          { finish: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (brandFilters.length > 0) {
        pipeWhere.brand = { in: brandFilters };
      }

      const pipes = await prisma.pipe.findMany({
        where: pipeWhere,
        take: limitNum,
      });

      // Get ratings and images for pipes
      const pipeIds = pipes.map(pipe => pipe.id);
      const [pipeRatings, pipeImages] = await Promise.all([
        prisma.rating.findMany({
          where: {
            itemId: { in: pipeIds },
            itemType: 'pipe',
          },
          select: {
            itemId: true,
            rating: true,
          },
        }),
        prisma.image.findMany({
          where: {
            itemId: { in: pipeIds },
            itemType: 'pipe',
            isFeatured: true,
          },
          select: {
            itemId: true,
            filename: true,
          },
        }),
      ]);

      const transformedPipes = pipes.map((pipe) => {
        const ratings = pipeRatings.filter(r => r.itemId === pipe.id);
        const image = pipeImages.find(img => img.itemId === pipe.id);
        
        return {
          id: pipe.id,
          name: pipe.name,
          manufacturer: pipe.brand,
          type: 'pipe' as const,
          images: image ? [`/api/images/${image.filename}`] : [],
          description: `${pipe.material} - ${pipe.shape} - ${pipe.finish}`,
          averageRating: ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0,
          totalRatings: ratings.length,
          category: pipe.shape,
          brand: pipe.brand,
          shape: pipe.shape,
        };
      });

      allResults.push(...transformedPipes);
    }

    // Search in tobaccos if no type filter or includes 'tobacco'
    if (typeFilters.length === 0 || typeFilters.includes('tobacco')) {
      const tobaccoWhere: any = {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { blendType: { contains: query, mode: 'insensitive' } },
          { contents: { contains: query, mode: 'insensitive' } },
          { cut: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (brandFilters.length > 0) {
        tobaccoWhere.brand = { in: brandFilters };
      }

      const tobaccos = await prisma.tobacco.findMany({
        where: tobaccoWhere,
        take: limitNum,
      });

      // Get ratings and images for tobaccos
      const tobaccoIds = tobaccos.map(tobacco => tobacco.id);
      const [tobaccoRatings, tobaccoImages] = await Promise.all([
        prisma.rating.findMany({
          where: {
            itemId: { in: tobaccoIds },
            itemType: 'tobacco',
          },
          select: {
            itemId: true,
            rating: true,
          },
        }),
        prisma.image.findMany({
          where: {
            itemId: { in: tobaccoIds },
            itemType: 'tobacco',
            isFeatured: true,
          },
          select: {
            itemId: true,
            filename: true,
          },
        }),
      ]);

      const transformedTobaccos = tobaccos.map((tobacco) => {
        const ratings = tobaccoRatings.filter(r => r.itemId === tobacco.id);
        const image = tobaccoImages.find(img => img.itemId === tobacco.id);
        
        return {
          id: tobacco.id,
          name: tobacco.name,
          manufacturer: tobacco.brand,
          type: 'tobacco' as const,
          images: image ? [`/api/images/${image.filename}`] : [],
          description: `${tobacco.blendType} - ${tobacco.cut}`,
          averageRating: ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0,
          totalRatings: ratings.length,
          category: tobacco.blendType,
          brand: tobacco.brand,
          blendType: tobacco.blendType,
        };
      });

      allResults.push(...transformedTobaccos);
    }

    // Search in accessories if no type filter or includes 'accessory'
    if (typeFilters.length === 0 || typeFilters.includes('accessory')) {
      const accessoryWhere: any = {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (brandFilters.length > 0) {
        accessoryWhere.brand = { in: brandFilters };
      }

      if (categoryFilters.length > 0) {
        accessoryWhere.category = { in: categoryFilters };
      }

      const accessories = await prisma.accessory.findMany({
        where: accessoryWhere,
        take: limitNum,
      });

      // Get ratings and images for accessories
      const accessoryIds = accessories.map(accessory => accessory.id);
      const [accessoryRatings, accessoryImages] = await Promise.all([
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

      const transformedAccessories = accessories.map((accessory) => {
        const ratings = accessoryRatings.filter(r => r.itemId === accessory.id);
        const image = accessoryImages.find(img => img.itemId === accessory.id);
        
        return {
          id: accessory.id,
          name: accessory.name,
          manufacturer: accessory.brand || 'N/A',
          type: 'accessory' as const,
          images: image ? [`/api/images/${image.filename}`] : [],
          description: accessory.description,
          averageRating: ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0,
          totalRatings: ratings.length,
          category: accessory.category,
        };
      });

      allResults.push(...transformedAccessories);
    }

    // Sort results based on relevance and other criteria
    if (sortBy === 'relevance') {
      // Sort by relevance: exact matches first, then partial matches
      allResults.sort((a, b) => {
        const aExact = a.name.toLowerCase() === query.toLowerCase() ? 1 : 0;
        const bExact = b.name.toLowerCase() === query.toLowerCase() ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        
        const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
        
        return a.name.localeCompare(b.name);
      });
    } else {
      // Sort by other criteria
      allResults.sort((a, b) => {
        const sortField = Array.isArray(sortBy) ? sortBy[0] : sortBy;
        const aValue = (a as any)[sortField] || '';
        const bValue = (b as any)[sortField] || '';
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const paginatedResults = allResults.slice(skip, skip + limitNum);
    const totalResults = allResults.length;

    // Generate suggestions if few results
    if (totalResults < 3) {
      const commonTerms = ['Peterson', 'Savinelli', 'Virginia', 'English', 'Aromatic', 'Bent', 'Straight'];
      suggestions = commonTerms.filter(term => 
        term.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 3);
    }

    res.status(200).json({
      results: paginatedResults,
      total: totalResults,
      page: pageNum,
      totalPages: Math.ceil(totalResults / limitNum),
      hasNextPage: pageNum < Math.ceil(totalResults / limitNum),
      hasPreviousPage: pageNum > 1,
      suggestions,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}