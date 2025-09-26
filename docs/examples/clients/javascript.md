# JavaScript API Client Library

Pre-built JavaScript client library for easy integration with the Pipes & Tobacco Collection API.

## Installation

### Via npm (if published)

```bash
npm install pipes-collection-api-client
```

### Direct inclusion

```html
<script src="./pipes-api-client.js"></script>
```

## API Client Implementation

### Complete Client Library

```javascript
/**
 * Pipes & Tobacco Collection API Client
 * A complete JavaScript client for the collection API
 */
class PipesCollectionAPI {
    constructor(config = {}) {
        this.baseURL = config.baseURL || 'http://localhost:3000/api';
        this.timeout = config.timeout || 10000;
        this.retries = config.retries || 3;
        
        // Create axios-like instance with fetch
        this.client = this.createClient();
    }

    createClient() {
        const self = this;
        
        return {
            async request(config) {
                const url = config.url.startsWith('http') ? config.url : `${self.baseURL}${config.url}`;
                
                const requestConfig = {
                    method: config.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...config.headers
                    },
                    credentials: 'include', // Include cookies for authentication
                    ...config
                };

                if (config.data && requestConfig.method !== 'GET') {
                    requestConfig.body = JSON.stringify(config.data);
                }

                if (config.params && requestConfig.method === 'GET') {
                    const params = new URLSearchParams(config.params);
                    url += (url.includes('?') ? '&' : '?') + params.toString();
                }

                let lastError;
                
                for (let attempt = 0; attempt < self.retries; attempt++) {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), self.timeout);
                        
                        const response = await fetch(url, {
                            ...requestConfig,
                            signal: controller.signal
                        });
                        
                        clearTimeout(timeoutId);
                        
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new APIError(
                                errorData.error || `HTTP ${response.status}`,
                                response.status,
                                errorData
                            );
                        }
                        
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            return await response.json();
                        }
                        
                        return response;
                    } catch (error) {
                        lastError = error;
                        
                        if (error.name === 'AbortError') {
                            throw new APIError('Request timeout', 408);
                        }
                        
                        if (attempt === self.retries - 1 || error.status < 500) {
                            throw error;
                        }
                        
                        // Wait before retry with exponential backoff
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                    }
                }
                
                throw lastError;
            },

            get(url, config = {}) {
                return this.request({ ...config, method: 'GET', url });
            },

            post(url, data, config = {}) {
                return this.request({ ...config, method: 'POST', url, data });
            },

            put(url, data, config = {}) {
                return this.request({ ...config, method: 'PUT', url, data });
            },

            delete(url, config = {}) {
                return this.request({ ...config, method: 'DELETE', url });
            }
        };
    }

    // Collection methods
    async getPipes(params = {}) {
        return await this.client.get('/pipes', { params });
    }

    async getPipe(id) {
        return await this.client.get(`/pipes/${id}`);
    }

    async getTobaccos(params = {}) {
        return await this.client.get('/tobaccos', { params });
    }

    async getTobacco(id) {
        return await this.client.get(`/tobaccos/${id}`);
    }

    async getAccessories(params = {}) {
        return await this.client.get('/accessories', { params });
    }

    async getAccessory(id) {
        return await this.client.get(`/accessories/${id}`);
    }

    async search(query, type = '') {
        return await this.client.get('/search', {
            params: { q: query, type }
        });
    }

    // User interaction methods
    async getComments(itemType, itemId) {
        return await this.client.get(`/${itemType}/${itemId}/comments`);
    }

    async submitComment(itemType, itemId, comment) {
        return await this.client.post(`/${itemType}/${itemId}/comments`, {
            content: comment.content,
            author_name: comment.authorName,
            session_id: comment.sessionId || this.generateSessionId()
        });
    }

    async submitRating(itemType, itemId, rating) {
        return await this.client.post(`/${itemType}/${itemId}/rating`, {
            rating: rating,
            session_id: this.generateSessionId()
        });
    }

    // Authentication methods
    async login(email, password) {
        return await this.client.post('/auth/signin', { email, password });
    }

    async logout() {
        return await this.client.post('/auth/signout');
    }

    async getSession() {
        return await this.client.get('/auth/session');
    }

    // Admin methods
    async getAdminDashboard() {
        return await this.client.get('/admin/dashboard');
    }

    async createPipe(pipeData) {
        return await this.client.post('/admin/pipes', pipeData);
    }

    async updatePipe(id, pipeData) {
        return await this.client.put(`/admin/pipes/${id}`, pipeData);
    }

    async deletePipe(id) {
        return await this.client.delete(`/admin/pipes/${id}`);
    }

    async uploadImages(formData) {
        // For file uploads, we need to use FormData and not set Content-Type
        return await this.client.request({
            method: 'POST',
            url: '/admin/upload-images',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }

    // Utility methods
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getImageUrl(filename) {
        return `${this.baseURL}/images/${filename}`;
    }
}

// Custom error class
class APIError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.code = data.code;
        this.details = data.details;
        this.timestamp = data.timestamp;
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { PipesCollectionAPI, APIError };
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.PipesCollectionAPI = PipesCollectionAPI;
    window.APIError = APIError;
}
```

## Usage Examples

### Basic Setup

```javascript
// Initialize the API client
const api = new PipesCollectionAPI({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3
});

// For production
const api = new PipesCollectionAPI({
    baseURL: 'https://your-domain.com/api'
});
```

### Collection Operations

```javascript
// Get all pipes with filtering
async function loadPipes() {
    try {
        const response = await api.getPipes({
            page: 1,
            limit: 20,
            brand: 'Peterson',
            country: 'Ireland'
        });
        
        console.log('Pipes:', response.data);
        console.log('Pagination:', response.meta.pagination);
        
        return response;
    } catch (error) {
        console.error('Failed to load pipes:', error.message);
    }
}

// Submit rating
async function ratePipe(pipeId, rating) {
    try {
        const response = await api.submitRating('pipe', pipeId, rating);
        console.log('Rating submitted:', response.message);
        return response;
    } catch (error) {
        console.error('Failed to submit rating:', error.message);
    }
}
```

This JavaScript client library provides a complete, production-ready solution for integrating with the Pipes & Tobacco Collection API.