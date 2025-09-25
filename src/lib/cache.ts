import { redis } from './redis';

export const cacheKeys = {
  pipes: (page: number, filter: string, sort: string) => `pipes:${page}:${filter}:${sort}`,
  tobaccos: (page: number, filter: string, sort: string) => `tobaccos:${page}:${filter}:${sort}`,
  accessories: (page: number, filter: string, sort: string) => `accessories:${page}:${filter}:${sort}`,
  pipe: (id: string) => `pipe:${id}`,
  tobacco: (id: string) => `tobacco:${id}`,
  accessory: (id: string) => `accessory:${id}`,
  stats: 'admin:stats',
  search: (query: string) => `search:${query}`,
};

export const cache = {
  // Cache com TTL padrão de 5 minutos
  async get<T>(key: string): Promise<T | null> {
    try {
      await redis.connect();
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttl: number = 300): Promise<boolean> {
    try {
      await redis.connect();
      await redis.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    try {
      await redis.connect();
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  async delPattern(pattern: string): Promise<boolean> {
    try {
      await redis.connect();
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  },

  // Invalidar cache relacionado quando items são alterados
  async invalidateItem(itemType: 'pipe' | 'tobacco' | 'accessory', id?: string) {
    try {
      // Invalidar listas
      await this.delPattern(`${itemType}s:*`);
      
      // Invalidar item específico se ID fornecido
      if (id) {
        await this.del(cacheKeys[itemType](id));
      }
      
      // Invalidar stats
      await this.del(cacheKeys.stats);
      
      // Invalidar busca
      await this.delPattern('search:*');
      
      return true;
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return false;
    }
  },
};

// Helper para usar cache em APIs
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> => {
  // Tentar buscar do cache primeiro
  const cached = await cache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Se não estiver em cache, buscar dados
  const data = await fetcher();
  
  // Salvar no cache
  await cache.set(key, data, ttl);
  
  return data;
};