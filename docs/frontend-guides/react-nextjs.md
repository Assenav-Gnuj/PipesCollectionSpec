# React/Next.js Frontend Implementation Guide

Complete guide for building a React/Next.js frontend to consume the Pipes & Tobacco Collection API.

## Overview

This guide shows how to build a modern React frontend using Next.js 14+ with TypeScript, demonstrating:
- API integration patterns
- Authentication handling  
- Component architecture
- State management
- Image handling
- Form management

## Project Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest pipes-frontend --typescript --tailwind --eslint --app
cd pipes-frontend
```

### 2. Install Dependencies

```bash
npm install @tanstack/react-query axios next-auth
npm install -D @types/node
```

### 3. Environment Configuration

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key

# Backend API URL for server-side requests
API_URL=http://localhost:3000/api
```

## API Client Setup

### Base API Client

Create `lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
});

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  // Headers are automatically included via cookies
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Type Definitions

Create `types/api.ts`:

```typescript
// Collection item types
export interface Pipe {
  id: string;
  name: string;
  brand: string;
  material: string;
  shape: string;
  finish: string;
  filter_type: string;
  stem_material: string;
  country: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  featured_image?: Image;
  images?: Image[];
  average_rating?: number;
  rating_count?: number;
  comment_count?: number;
}

export interface Tobacco {
  id: string;
  name: string;
  brand: string;
  blend_type: string;
  contents: string;
  cut: string;
  strength: number;
  room_note: number;
  taste: number;
  observations?: string;
  created_at: string;
  updated_at: string;
  featured_image?: Image;
  images?: Image[];
  average_rating?: number;
  rating_count?: number;
  comment_count?: number;
}

export interface Accessory {
  id: string;
  name: string;
  brand?: string;
  category: string;
  description: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  featured_image?: Image;
  images?: Image[];
  average_rating?: number;
  rating_count?: number;
  comment_count?: number;
}

export interface Image {
  id: string;
  filename: string;
  alt_text: string;
  width: number;
  height: number;
  is_featured: boolean;
  sort_order: number;
}

export interface Comment {
  id: string;
  content: string;
  author_name?: string;
  created_at: string;
}

export interface Rating {
  rating: number;
  session_id: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      has_next: boolean;
      has_prev: boolean;
    };
    filters?: any;
  };
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string>;
  timestamp: string;
}
```

## API Service Functions

Create `services/collectionService.ts`:

```typescript
import apiClient from '@/lib/api';
import { Pipe, Tobacco, Accessory, PaginatedResponse, Comment, Rating } from '@/types/api';

export class CollectionService {
  // Pipes
  static async getPipes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    country?: string;
  }): Promise<PaginatedResponse<Pipe>> {
    const response = await apiClient.get('/pipes', { params });
    return response.data;
  }

  static async getPipe(id: string): Promise<{ data: Pipe }> {
    const response = await apiClient.get(`/pipes/${id}`);
    return response.data;
  }

  // Tobaccos
  static async getTobaccos(params?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    blend_type?: string;
  }): Promise<PaginatedResponse<Tobacco>> {
    const response = await apiClient.get('/tobaccos', { params });
    return response.data;
  }

  static async getTobacco(id: string): Promise<{ data: Tobacco }> {
    const response = await apiClient.get(`/tobaccos/${id}`);
    return response.data;
  }

  // Accessories
  static async getAccessories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<PaginatedResponse<Accessory>> {
    const response = await apiClient.get('/accessories', { params });
    return response.data;
  }

  static async getAccessory(id: string): Promise<{ data: Accessory }> {
    const response = await apiClient.get(`/accessories/${id}`);
    return response.data;
  }

  // Search
  static async search(query: string, type?: string) {
    const response = await apiClient.get('/search', {
      params: { q: query, type }
    });
    return response.data;
  }

  // Comments
  static async getComments(type: string, id: string): Promise<{ comments: Comment[] }> {
    const response = await apiClient.get(`/${type}/${id}/comments`);
    return response.data;
  }

  static async submitComment(type: string, id: string, comment: {
    content: string;
    author_name?: string;
    session_id: string;
  }) {
    const response = await apiClient.post(`/${type}/${id}/comments`, comment);
    return response.data;
  }

  // Ratings
  static async submitRating(type: string, id: string, rating: Rating) {
    const response = await apiClient.post(`/${type}/${id}/rating`, rating);
    return response.data;
  }
}
```

## React Query Setup

Create `lib/queryClient.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});
```

Update `app/layout.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Custom Hooks

Create `hooks/useCollection.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService } from '@/services/collectionService';

// Pipes
export function usePipes(params?: Parameters<typeof CollectionService.getPipes>[0]) {
  return useQuery({
    queryKey: ['pipes', params],
    queryFn: () => CollectionService.getPipes(params),
  });
}

export function usePipe(id: string) {
  return useQuery({
    queryKey: ['pipe', id],
    queryFn: () => CollectionService.getPipe(id),
    enabled: !!id,
  });
}

// Tobaccos
export function useTobaccos(params?: Parameters<typeof CollectionService.getTobaccos>[0]) {
  return useQuery({
    queryKey: ['tobaccos', params],
    queryFn: () => CollectionService.getTobaccos(params),
  });
}

export function useTobacco(id: string) {
  return useQuery({
    queryKey: ['tobacco', id],
    queryFn: () => CollectionService.getTobacco(id),
    enabled: !!id,
  });
}

// Comments
export function useComments(type: string, id: string) {
  return useQuery({
    queryKey: ['comments', type, id],
    queryFn: () => CollectionService.getComments(type, id),
    enabled: !!type && !!id,
  });
}

export function useSubmitComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, id, comment }: {
      type: string;
      id: string;
      comment: Parameters<typeof CollectionService.submitComment>[2];
    }) => CollectionService.submitComment(type, id, comment),
    onSuccess: (_, { type, id }) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['comments', type, id] });
    },
  });
}

// Ratings
export function useSubmitRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, id, rating }: {
      type: string;
      id: string;
      rating: Parameters<typeof CollectionService.submitRating>[2];
    }) => CollectionService.submitRating(type, id, rating),
    onSuccess: (_, { type, id }) => {
      // Invalidate item query to update rating
      queryClient.invalidateQueries({ queryKey: [type, id] });
    },
  });
}
```

## Components

### Item Card Component

Create `components/ItemCard.tsx`:

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Pipe, Tobacco, Accessory } from '@/types/api';
import { StarRating } from './StarRating';

interface ItemCardProps {
  item: Pipe | Tobacco | Accessory;
  type: 'pipe' | 'tobacco' | 'accessory';
}

export function ItemCard({ item, type }: ItemCardProps) {
  const imageUrl = item.featured_image 
    ? `/api/images/${item.featured_image.filename}`
    : '/placeholder-image.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${type}s/${item.id}`}>
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={item.featured_image?.alt_text || item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {item.name}
          </h3>
          
          <p className="text-gray-600 mb-2">{item.brand}</p>
          
          {type === 'pipe' && (
            <p className="text-sm text-gray-500">
              {(item as Pipe).country} • {(item as Pipe).material}
            </p>
          )}
          
          {type === 'tobacco' && (
            <p className="text-sm text-gray-500">
              {(item as Tobacco).blend_type} • Strength: {(item as Tobacco).strength}
            </p>
          )}
          
          {type === 'accessory' && (
            <p className="text-sm text-gray-500">
              {(item as Accessory).category}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <StarRating 
              rating={item.average_rating || 0} 
              count={item.rating_count || 0} 
            />
            <span className="text-sm text-gray-500">
              {item.comment_count || 0} comments
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
```

### Star Rating Component

Create `components/StarRating.tsx`:

```typescript
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ rating, count, interactive = false, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  const renderStar = (index: number) => {
    const value = index + 1;
    const filled = (hoverRating || rating) >= value;
    
    return (
      <button
        key={index}
        className={`text-xl ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        onClick={() => handleClick(value)}
        onMouseEnter={() => interactive && setHoverRating(value)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        disabled={!interactive}
      >
        <span className={filled ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      </button>
    );
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-600 ml-2">
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
}
```

### Collection List Page

Create `app/pipes/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { usePipes } from '@/hooks/useCollection';
import { ItemCard } from '@/components/ItemCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';

export default function PipesPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    brand: '',
    country: '',
  });
  
  const { data, isLoading, error } = usePipes(filters);
  
  if (isLoading) return <div>Loading pipes...</div>;
  if (error) return <div>Error loading pipes</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pipe Collection</h1>
      
      <div className="flex gap-8">
        <FilterSidebar
          filters={data?.meta.filters}
          selectedFilters={filters}
          onFiltersChange={setFilters}
        />
        
        <div className="flex-1">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters({ ...filters, search, page: 1 })}
            placeholder="Search pipes..."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data?.data.map((pipe) => (
              <ItemCard key={pipe.id} item={pipe} type="pipe" />
            ))}
          </div>
          
          {data?.meta.pagination && (
            <Pagination
              currentPage={data.meta.pagination.current_page}
              totalPages={data.meta.pagination.total_pages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

### Item Detail Page

Create `app/pipes/[id]/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePipe, useComments, useSubmitComment, useSubmitRating } from '@/hooks/useCollection';
import { StarRating } from '@/components/StarRating';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';

interface PipeDetailPageProps {
  params: { id: string };
}

export default function PipeDetailPage({ params }: PipeDetailPageProps) {
  const { data, isLoading, error } = usePipe(params.id);
  const { data: commentsData } = useComments('pipe', params.id);
  const submitRating = useSubmitRating();
  const submitComment = useSubmitComment();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (isLoading) return <div>Loading pipe details...</div>;
  if (error) return <div>Error loading pipe</div>;
  if (!data) return <div>Pipe not found</div>;
  
  const pipe = data.data;
  const images = pipe.images || [];
  const selectedImage = images[selectedImageIndex] || pipe.featured_image;
  
  const handleRatingChange = async (rating: number) => {
    try {
      await submitRating.mutateAsync({
        type: 'pipe',
        id: pipe.id,
        rating: {
          rating,
          session_id: generateSessionId(), // Implement session ID generation
        },
      });
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {selectedImage && (
            <div className="relative h-96 mb-4">
              <Image
                src={`/api/images/${selectedImage.filename}`}
                alt={selectedImage.alt_text}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={`/api/images/${image.filename}`}
                    alt={image.alt_text}
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{pipe.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{pipe.brand}</p>
          
          <div className="space-y-4 mb-6">
            <div><strong>Material:</strong> {pipe.material}</div>
            <div><strong>Shape:</strong> {pipe.shape}</div>
            <div><strong>Finish:</strong> {pipe.finish}</div>
            <div><strong>Filter:</strong> {pipe.filter_type}</div>
            <div><strong>Stem:</strong> {pipe.stem_material}</div>
            <div><strong>Country:</strong> {pipe.country}</div>
          </div>
          
          {pipe.observations && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Observations</h3>
              <p className="text-gray-700">{pipe.observations}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Rating</h3>
            <StarRating
              rating={pipe.average_rating || 0}
              count={pipe.rating_count}
              interactive
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        <CommentForm
          onSubmit={async (comment) => {
            await submitComment.mutateAsync({
              type: 'pipe',
              id: pipe.id,
              comment: {
                ...comment,
                session_id: generateSessionId(),
              },
            });
          }}
          isSubmitting={submitComment.isPending}
        />
        
        <CommentList comments={commentsData?.comments || []} />
      </div>
    </div>
  );
}

// Utility function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

## Authentication Setup

For admin features, set up NextAuth.js:

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Call your backend API for authentication
          const response = await fetch(`${process.env.API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          
          if (response.ok) {
            const user = await response.json();
            return user;
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
        
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
});

export { handler as GET, handler as POST };
```

## Deployment

### Build Configuration

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-api-domain.com'],
    // For image optimization with your API
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/images/**',
      },
    ],
  },
  // Proxy API requests during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start

# Or deploy to Vercel
npm install -g vercel
vercel --prod
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Loading States**: Show loading indicators for better UX
3. **Caching**: Use React Query for intelligent caching
4. **Image Optimization**: Use Next.js Image component
5. **SEO**: Add proper meta tags and structured data
6. **Accessibility**: Include proper ARIA labels and keyboard navigation
7. **Performance**: Implement code splitting and lazy loading

This guide provides a solid foundation for building a React/Next.js frontend that fully integrates with the Pipes & Tobacco Collection API.