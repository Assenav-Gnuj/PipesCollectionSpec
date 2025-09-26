# Vue.js Frontend Implementation Guide

Complete guide for building a Vue.js 3 frontend with TypeScript to consume the Pipes & Tobacco Collection API.

## Overview

This guide demonstrates building a modern Vue.js 3 frontend using:
- Vue 3 Composition API
- TypeScript
- Pinia for state management
- Vue Router
- Axios for HTTP requests
- Tailwind CSS for styling

## Project Setup

### 1. Initialize Vue Project

```bash
npm create vue@latest pipes-frontend
cd pipes-frontend

# Select the following options:
# ✅ TypeScript
# ✅ Router
# ✅ Pinia
# ✅ ESLint
# ✅ Prettier
```

### 2. Install Additional Dependencies

```bash
npm install axios @tanstack/vue-query
npm install -D @types/node
```

### 3. Environment Configuration

Create `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
```

Create `.env.local`:

```bash
VITE_API_URL=http://localhost:3000/api
```

## API Client Setup

### Base API Client

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Type Definitions

Create `src/types/api.ts`:

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

## API Services

Create `src/services/collectionService.ts`:

```typescript
import apiClient from '@/lib/api';
import type { Pipe, Tobacco, Accessory, PaginatedResponse, Comment, Rating } from '@/types/api';

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

## Pinia Store

Create `src/stores/collection.ts`:

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CollectionService } from '@/services/collectionService';
import type { Pipe, Tobacco, Accessory, PaginatedResponse } from '@/types/api';

export const useCollectionStore = defineStore('collection', () => {
  // State
  const pipes = ref<PaginatedResponse<Pipe> | null>(null);
  const tobaccos = ref<PaginatedResponse<Tobacco> | null>(null);
  const accessories = ref<PaginatedResponse<Accessory> | null>(null);
  const currentItem = ref<Pipe | Tobacco | Accessory | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const pipesData = computed(() => pipes.value?.data || []);
  const tobaccosData = computed(() => tobaccos.value?.data || []);
  const accessoriesData = computed(() => accessories.value?.data || []);
  const isLoading = computed(() => loading.value);

  // Actions
  async function fetchPipes(params?: Parameters<typeof CollectionService.getPipes>[0]) {
    loading.value = true;
    error.value = null;
    
    try {
      pipes.value = await CollectionService.getPipes(params);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch pipes';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPipe(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await CollectionService.getPipe(id);
      currentItem.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch pipe';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTobaccos(params?: Parameters<typeof CollectionService.getTobaccos>[0]) {
    loading.value = true;
    error.value = null;
    
    try {
      tobaccos.value = await CollectionService.getTobaccos(params);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tobaccos';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTobacco(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await CollectionService.getTobacco(id);
      currentItem.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tobacco';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAccessories(params?: Parameters<typeof CollectionService.getAccessories>[0]) {
    loading.value = true;
    error.value = null;
    
    try {
      accessories.value = await CollectionService.getAccessories(params);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch accessories';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAccessory(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await CollectionService.getAccessory(id);
      currentItem.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch accessory';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearCurrentItem() {
    currentItem.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    pipes,
    tobaccos,
    accessories,
    currentItem,
    loading,
    error,
    
    // Getters
    pipesData,
    tobaccosData,
    accessoriesData,
    isLoading,
    
    // Actions
    fetchPipes,
    fetchPipe,
    fetchTobaccos,
    fetchTobacco,
    fetchAccessories,
    fetchAccessory,
    clearCurrentItem,
    clearError,
  };
});
```

## Vue Router Configuration

Update `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pipes',
      name: 'pipes',
      component: () => import('@/views/PipesView.vue'),
    },
    {
      path: '/pipes/:id',
      name: 'pipe-detail',
      component: () => import('@/views/PipeDetailView.vue'),
      props: true,
    },
    {
      path: '/tobaccos',
      name: 'tobaccos',
      component: () => import('@/views/TobaccosView.vue'),
    },
    {
      path: '/tobaccos/:id',
      name: 'tobacco-detail',
      component: () => import('@/views/TobaccoDetailView.vue'),
      props: true,
    },
    {
      path: '/accessories',
      name: 'accessories',
      component: () => import('@/views/AccessoriesView.vue'),
    },
    {
      path: '/accessories/:id',
      name: 'accessory-detail',
      component: () => import('@/views/AccessoryDetailView.vue'),
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
  ],
});

export default router;
```

## Components

### Item Card Component

Create `src/components/ItemCard.vue`:

```vue
<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <router-link :to="{ name: `${type}-detail`, params: { id: item.id } }">
      <div class="relative h-48">
        <img
          :src="imageUrl"
          :alt="item.featured_image?.alt_text || item.name"
          class="w-full h-full object-cover"
          @error="onImageError"
        />
      </div>
      
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-2 line-clamp-2">
          {{ item.name }}
        </h3>
        
        <p class="text-gray-600 mb-2">{{ item.brand }}</p>
        
        <p v-if="type === 'pipe'" class="text-sm text-gray-500">
          {{ (item as Pipe).country }} • {{ (item as Pipe).material }}
        </p>
        
        <p v-if="type === 'tobacco'" class="text-sm text-gray-500">
          {{ (item as Tobacco).blend_type }} • Strength: {{ (item as Tobacco).strength }}
        </p>
        
        <p v-if="type === 'accessory'" class="text-sm text-gray-500">
          {{ (item as Accessory).category }}
        </p>
        
        <div class="mt-3 flex items-center justify-between">
          <StarRating 
            :rating="item.average_rating || 0"
            :count="item.rating_count || 0"
          />
          <span class="text-sm text-gray-500">
            {{ item.comment_count || 0 }} comments
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Pipe, Tobacco, Accessory } from '@/types/api';
import StarRating from './StarRating.vue';

interface Props {
  item: Pipe | Tobacco | Accessory;
  type: 'pipe' | 'tobacco' | 'accessory';
}

const props = defineProps<Props>();

const imageError = ref(false);

const imageUrl = computed(() => {
  if (imageError.value) {
    return '/placeholder-image.jpg';
  }
  return props.item.featured_image 
    ? `${import.meta.env.VITE_API_URL}/images/${props.item.featured_image.filename}`
    : '/placeholder-image.jpg';
});

const onImageError = () => {
  imageError.value = true;
};
</script>
```

### Star Rating Component

Create `src/components/StarRating.vue`:

```vue
<template>
  <div class="flex items-center gap-1">
    <div class="flex">
      <button
        v-for="(star, index) in 5"
        :key="index"
        :class="[
          'text-xl transition-transform',
          interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        ]"
        @click="handleClick(index + 1)"
        @mouseenter="() => interactive && setHoverRating(index + 1)"
        @mouseleave="() => interactive && setHoverRating(0)"
        :disabled="!interactive"
      >
        <span :class="isStarFilled(index + 1) ? 'text-yellow-400' : 'text-gray-300'">
          ★
        </span>
      </button>
    </div>
    <span v-if="count !== undefined" class="text-sm text-gray-600 ml-2">
      ({{ count }} {{ count === 1 ? 'rating' : 'ratings' }})
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  rating: number;
  count?: number;
  interactive?: boolean;
}

interface Emits {
  (e: 'rating-change', rating: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
});

const emit = defineEmits<Emits>();

const hoverRating = ref(0);

const isStarFilled = (starIndex: number) => {
  return (hoverRating.value || props.rating) >= starIndex;
};

const handleClick = (rating: number) => {
  if (props.interactive) {
    emit('rating-change', rating);
  }
};

const setHoverRating = (rating: number) => {
  hoverRating.value = rating;
};
</script>
```

### Search Bar Component

Create `src/components/SearchBar.vue`:

```vue
<template>
  <div class="relative">
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      @input="onInput"
      @keyup.enter="onSearch"
    />
    <svg
      class="absolute left-3 top-3 h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <button
      v-if="searchValue"
      @click="clearSearch"
      class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  debounce?: number;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  debounce: 300,
});

const emit = defineEmits<Emits>();

const searchValue = ref(props.modelValue);
let debounceTimeout: number;

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});

const onInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(() => {
    emit('update:modelValue', searchValue.value);
    emit('search', searchValue.value);
  }, props.debounce);
};

const onSearch = () => {
  clearTimeout(debounceTimeout);
  emit('update:modelValue', searchValue.value);
  emit('search', searchValue.value);
};

const clearSearch = () => {
  searchValue.value = '';
  emit('update:modelValue', '');
  emit('search', '');
};
</script>
```

## Views

### Pipes List View

Create `src/views/PipesView.vue`:

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Pipe Collection</h1>
    
    <div class="flex gap-8">
      <!-- Filters Sidebar -->
      <div class="w-64 flex-shrink-0">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="font-semibold mb-4">Filters</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Brand</label>
              <select v-model="filters.brand" class="w-full border rounded px-3 py-2">
                <option value="">All Brands</option>
                <option v-for="brand in availableBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Country</label>
              <select v-model="filters.country" class="w-full border rounded px-3 py-2">
                <option value="">All Countries</option>
                <option v-for="country in availableCountries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1">
        <SearchBar
          v-model="filters.search"
          placeholder="Search pipes..."
          @search="onSearch"
        />
        
        <div v-if="collectionStore.isLoading" class="text-center py-8">
          Loading pipes...
        </div>
        
        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error }}
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <ItemCard
            v-for="pipe in collectionStore.pipesData"
            :key="pipe.id"
            :item="pipe"
            type="pipe"
          />
        </div>
        
        <!-- Pagination -->
        <Pagination
          v-if="pipes?.meta.pagination"
          :current-page="pipes.meta.pagination.current_page"
          :total-pages="pipes.meta.pagination.total_pages"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, computed } from 'vue';
import { useCollectionStore } from '@/stores/collection';
import ItemCard from '@/components/ItemCard.vue';
import SearchBar from '@/components/SearchBar.vue';
import Pagination from '@/components/Pagination.vue';

const collectionStore = useCollectionStore();

const filters = reactive({
  page: 1,
  limit: 20,
  search: '',
  brand: '',
  country: '',
});

const pipes = computed(() => collectionStore.pipes);
const error = computed(() => collectionStore.error);

const availableBrands = computed(() => {
  return pipes.value?.meta.filters?.available_brands || [];
});

const availableCountries = computed(() => {
  return pipes.value?.meta.filters?.available_countries || [];
});

const fetchPipes = async () => {
  try {
    await collectionStore.fetchPipes(filters);
  } catch (err) {
    console.error('Failed to fetch pipes:', err);
  }
};

const onSearch = () => {
  filters.page = 1;
  fetchPipes();
};

const onPageChange = (page: number) => {
  filters.page = page;
  fetchPipes();
};

// Watch for filter changes
watch(
  () => [filters.brand, filters.country],
  () => {
    filters.page = 1;
    fetchPipes();
  }
);

onMounted(() => {
  fetchPipes();
});
</script>
```

### Pipe Detail View

Create `src/views/PipeDetailView.vue`:

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="collectionStore.isLoading" class="text-center py-8">
      Loading pipe details...
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>
    
    <div v-else-if="pipe" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Images -->
      <div>
        <div v-if="selectedImage" class="relative h-96 mb-4">
          <img
            :src="getImageUrl(selectedImage.filename)"
            :alt="selectedImage.alt_text"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div v-if="pipe.images && pipe.images.length > 1" class="flex gap-2 overflow-x-auto">
          <button
            v-for="(image, index) in pipe.images"
            :key="image.id"
            @click="selectedImageIndex = index"
            :class="[
              'relative w-20 h-20 flex-shrink-0 rounded border-2',
              selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
            ]"
          >
            <img
              :src="getImageUrl(image.filename)"
              :alt="image.alt_text"
              class="w-full h-full object-cover rounded"
            />
          </button>
        </div>
      </div>
      
      <!-- Details -->
      <div>
        <h1 class="text-3xl font-bold mb-4">{{ pipe.name }}</h1>
        <p class="text-xl text-gray-600 mb-6">{{ pipe.brand }}</p>
        
        <div class="space-y-4 mb-6">
          <div><strong>Material:</strong> {{ pipe.material }}</div>
          <div><strong>Shape:</strong> {{ pipe.shape }}</div>
          <div><strong>Finish:</strong> {{ pipe.finish }}</div>
          <div><strong>Filter:</strong> {{ pipe.filter_type }}</div>
          <div><strong>Stem:</strong> {{ pipe.stem_material }}</div>
          <div><strong>Country:</strong> {{ pipe.country }}</div>
        </div>
        
        <div v-if="pipe.observations" class="mb-6">
          <h3 class="font-semibold mb-2">Observations</h3>
          <p class="text-gray-700">{{ pipe.observations }}</p>
        </div>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Rating</h3>
          <StarRating
            :rating="pipe.average_rating || 0"
            :count="pipe.rating_count"
            :interactive="true"
            @rating-change="handleRatingChange"
          />
        </div>
      </div>
    </div>
    
    <!-- Comments Section -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Comments</h2>
      
      <CommentForm
        @submit="handleCommentSubmit"
        :loading="commentSubmitting"
      />
      
      <CommentList :comments="comments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCollectionStore } from '@/stores/collection';
import { CollectionService } from '@/services/collectionService';
import type { Pipe, Comment } from '@/types/api';
import StarRating from '@/components/StarRating.vue';
import CommentForm from '@/components/CommentForm.vue';
import CommentList from '@/components/CommentList.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const route = useRoute();
const collectionStore = useCollectionStore();

const selectedImageIndex = ref(0);
const comments = ref<Comment[]>([]);
const commentSubmitting = ref(false);

const pipe = computed(() => collectionStore.currentItem as Pipe);
const error = computed(() => collectionStore.error);

const selectedImage = computed(() => {
  if (!pipe.value?.images?.length) return pipe.value?.featured_image;
  return pipe.value.images[selectedImageIndex.value] || pipe.value.featured_image;
});

const getImageUrl = (filename: string) => {
  return `${import.meta.env.VITE_API_URL}/images/${filename}`;
};

const fetchPipeDetails = async () => {
  try {
    await collectionStore.fetchPipe(props.id);
    // Also fetch comments
    const commentsData = await CollectionService.getComments('pipe', props.id);
    comments.value = commentsData.comments;
  } catch (err) {
    console.error('Failed to fetch pipe details:', err);
  }
};

const handleRatingChange = async (rating: number) => {
  try {
    await CollectionService.submitRating('pipe', props.id, {
      rating,
      session_id: generateSessionId(),
    });
    // Refresh pipe data to show updated rating
    await collectionStore.fetchPipe(props.id);
  } catch (err) {
    console.error('Failed to submit rating:', err);
  }
};

const handleCommentSubmit = async (comment: { content: string; author_name?: string }) => {
  commentSubmitting.value = true;
  try {
    await CollectionService.submitComment('pipe', props.id, {
      ...comment,
      session_id: generateSessionId(),
    });
    // Refresh comments
    const commentsData = await CollectionService.getComments('pipe', props.id);
    comments.value = commentsData.comments;
  } catch (err) {
    console.error('Failed to submit comment:', err);
  } finally {
    commentSubmitting.value = false;
  }
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

onMounted(() => {
  fetchPipeDetails();
});
</script>
```

## Composables

Create `src/composables/useApi.ts`:

```typescript
import { ref } from 'vue';
import type { Ref } from 'vue';

export function useApi<T>(apiCall: () => Promise<T>) {
  const data: Ref<T | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (...args: any[]) => {
    loading.value = true;
    error.value = null;
    
    try {
      data.value = await apiCall(...args);
      return data.value;
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    error.value = null;
    loading.value = false;
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
```

## Build Configuration

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
```

## Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview

# Deploy to static hosting (Netlify, Vercel, etc.)
```

### Environment Variables for Production

Create `.env.production`:

```bash
VITE_API_URL=https://your-api-domain.com/api
```

## Best Practices

1. **State Management**: Use Pinia for centralized state management
2. **Error Handling**: Implement proper error boundaries and user feedback
3. **Loading States**: Show loading indicators for better UX
4. **Caching**: Implement intelligent caching strategies
5. **Type Safety**: Use TypeScript throughout the application
6. **Component Composition**: Use the Composition API for better code organization
7. **Accessibility**: Ensure proper ARIA attributes and keyboard navigation

This Vue.js implementation provides a solid foundation for building a modern frontend that fully integrates with the Pipes & Tobacco Collection API.