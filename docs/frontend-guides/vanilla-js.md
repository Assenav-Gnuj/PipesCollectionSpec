# Pure JavaScript Frontend Implementation Guide

Complete guide for building a vanilla JavaScript frontend to consume the Pipes & Tobacco Collection API without any frameworks.

## Overview

This guide demonstrates building a modern frontend using:
- Pure JavaScript ES6+
- Fetch API for HTTP requests
- Web Components for reusable UI
- CSS3 with CSS Grid and Flexbox
- LocalStorage for session management
- No build tools required

## Project Structure

```
pipes-frontend/
├── index.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── api/
│   │   ├── client.js
│   │   └── services.js
│   ├── components/
│   │   ├── ItemCard.js
│   │   ├── StarRating.js
│   │   ├── SearchBar.js
│   │   └── Pagination.js
│   ├── pages/
│   │   ├── PipesPage.js
│   │   ├── PipeDetailPage.js
│   │   └── HomePage.js
│   ├── utils/
│   │   ├── dom.js
│   │   ├── session.js
│   │   └── helpers.js
│   ├── router.js
│   └── app.js
├── pages/
│   ├── pipes.html
│   ├── tobaccos.html
│   ├── accessories.html
│   └── admin/
│       └── login.html
└── assets/
    ├── images/
    └── icons/
```

## Setup

### 1. HTML Structure

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pipes & Tobacco Collection</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <!-- Meta tags for SEO -->
    <meta name="description" content="Browse our extensive collection of pipes, tobaccos, and accessories">
    <meta name="keywords" content="pipes, tobacco, smoking, collection">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="/">Pipes Collection</a>
            </div>
            <ul class="nav-menu">
                <li><a href="/" data-route="home">Home</a></li>
                <li><a href="/pipes" data-route="pipes">Pipes</a></li>
                <li><a href="/tobaccos" data-route="tobaccos">Tobaccos</a></li>
                <li><a href="/accessories" data-route="accessories">Accessories</a></li>
                <li><a href="/search" data-route="search">Search</a></li>
            </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <main id="app">
        <!-- Dynamic content will be loaded here -->
        <div id="loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
        
        <div id="error" class="error-message hidden">
            <p id="error-text"></p>
            <button id="retry-button" class="btn btn-primary">Retry</button>
        </div>
        
        <div id="content">
            <!-- Page content will be injected here -->
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <p>&copy; 2025 Pipes & Tobacco Collection. All rights reserved.</p>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="js/utils/helpers.js"></script>
    <script src="js/utils/dom.js"></script>
    <script src="js/utils/session.js"></script>
    <script src="js/api/client.js"></script>
    <script src="js/api/services.js"></script>
    <script src="js/components/StarRating.js"></script>
    <script src="js/components/ItemCard.js"></script>
    <script src="js/components/SearchBar.js"></script>
    <script src="js/components/Pagination.js"></script>
    <script src="js/pages/HomePage.js"></script>
    <script src="js/pages/PipesPage.js"></script>
    <script src="js/pages/PipeDetailPage.js"></script>
    <script src="js/router.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### 2. API Client

Create `js/api/client.js`:

```javascript
class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            credentials: 'include', // Include cookies for authentication
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            // Check if response has content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return response;
        } catch (error) {
            console.error('API Request failed:', error);
            
            // Handle specific error cases
            if (error.message.includes('401')) {
                // Unauthorized - redirect to login if accessing admin
                if (endpoint.includes('/admin/')) {
                    window.location.href = '/admin/login';
                }
            }
            
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Create global instance
window.apiClient = new ApiClient();
```

### 3. API Services

Create `js/api/services.js`:

```javascript
class CollectionService {
    static async getPipes(params = {}) {
        return await apiClient.get('/pipes', params);
    }

    static async getPipe(id) {
        return await apiClient.get(`/pipes/${id}`);
    }

    static async getTobaccos(params = {}) {
        return await apiClient.get('/tobaccos', params);
    }

    static async getTobacco(id) {
        return await apiClient.get(`/tobaccos/${id}`);
    }

    static async getAccessories(params = {}) {
        return await apiClient.get('/accessories', params);
    }

    static async getAccessory(id) {
        return await apiClient.get(`/accessories/${id}`);
    }

    static async search(query, type = '') {
        return await apiClient.get('/search', { q: query, type });
    }

    static async getComments(type, id) {
        return await apiClient.get(`/${type}/${id}/comments`);
    }

    static async submitComment(type, id, comment) {
        return await apiClient.post(`/${type}/${id}/comments`, comment);
    }

    static async submitRating(type, id, rating) {
        return await apiClient.post(`/${type}/${id}/rating`, rating);
    }
}

class AuthService {
    static async login(email, password) {
        return await apiClient.post('/auth/signin', { email, password });
    }

    static async logout() {
        return await apiClient.post('/auth/signout');
    }

    static async getSession() {
        return await apiClient.get('/auth/session');
    }
}

// Make services globally available
window.CollectionService = CollectionService;
window.AuthService = AuthService;
```

### 4. Utility Functions

Create `js/utils/helpers.js`:

```javascript
// DOM utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Create element helper
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    // Add children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate session ID
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Show/hide loading
function showLoading() {
    $('#loading').classList.remove('hidden');
    $('#content').classList.add('hidden');
    $('#error').classList.add('hidden');
}

function hideLoading() {
    $('#loading').classList.add('hidden');
    $('#content').classList.remove('hidden');
}

function showError(message) {
    $('#loading').classList.add('hidden');
    $('#content').classList.add('hidden');
    $('#error').classList.remove('hidden');
    $('#error-text').textContent = message;
}

// Make functions globally available
window.utils = {
    $,
    $$,
    createElement,
    debounce,
    formatDate,
    generateSessionId,
    getSessionId,
    showLoading,
    hideLoading,
    showError
};
```

### 5. Components

Create `js/components/StarRating.js`:

```javascript
class StarRating {
    constructor(container, options = {}) {
        this.container = container;
        this.rating = options.rating || 0;
        this.count = options.count;
        this.interactive = options.interactive || false;
        this.onRatingChange = options.onRatingChange;
        
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'star-rating';

        const starsContainer = createElement('div', { className: 'stars' });
        
        for (let i = 1; i <= 5; i++) {
            const star = createElement('button', {
                className: `star ${this.rating >= i ? 'filled' : ''}`,
                innerHTML: '★',
                'data-rating': i
            });

            if (this.interactive) {
                star.addEventListener('click', () => this.handleStarClick(i));
                star.addEventListener('mouseenter', () => this.handleStarHover(i));
            } else {
                star.disabled = true;
            }

            starsContainer.appendChild(star);
        }

        if (this.interactive) {
            starsContainer.addEventListener('mouseleave', () => this.handleMouseLeave());
        }

        this.container.appendChild(starsContainer);

        if (this.count !== undefined) {
            const countText = createElement('span', {
                className: 'rating-count',
                textContent: `(${this.count} ${this.count === 1 ? 'rating' : 'ratings'})`
            });
            this.container.appendChild(countText);
        }
    }

    handleStarClick(rating) {
        this.rating = rating;
        this.updateStars();
        if (this.onRatingChange) {
            this.onRatingChange(rating);
        }
    }

    handleStarHover(rating) {
        this.updateStars(rating);
    }

    handleMouseLeave() {
        this.updateStars();
    }

    updateStars(hoverRating = null) {
        const stars = this.container.querySelectorAll('.star');
        const displayRating = hoverRating || this.rating;
        
        stars.forEach((star, index) => {
            if (index + 1 <= displayRating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
}

window.StarRating = StarRating;
```

Create `js/components/ItemCard.js`:

```javascript
class ItemCard {
    constructor(item, type) {
        this.item = item;
        this.type = type;
    }

    render() {
        const imageUrl = this.item.featured_image 
            ? `${apiClient.baseURL}/images/${this.item.featured_image.filename}`
            : '/assets/images/placeholder.jpg';

        const card = createElement('div', { className: 'item-card' });
        
        // Create card link
        const link = createElement('a', {
            href: `/${this.type}s/${this.item.id}`,
            className: 'item-link',
            'data-route': `${this.type}-detail`,
            'data-id': this.item.id
        });

        // Image container
        const imageContainer = createElement('div', { className: 'item-image' });
        const image = createElement('img', {
            src: imageUrl,
            alt: this.item.featured_image?.alt_text || this.item.name,
            loading: 'lazy'
        });
        image.onerror = () => {
            image.src = '/assets/images/placeholder.jpg';
        };
        imageContainer.appendChild(image);

        // Content container
        const content = createElement('div', { className: 'item-content' });
        
        const title = createElement('h3', {
            className: 'item-title',
            textContent: this.item.name
        });
        
        const brand = createElement('p', {
            className: 'item-brand',
            textContent: this.item.brand
        });

        // Type-specific info
        let typeInfo = '';
        if (this.type === 'pipe') {
            typeInfo = `${this.item.country} • ${this.item.material}`;
        } else if (this.type === 'tobacco') {
            typeInfo = `${this.item.blend_type} • Strength: ${this.item.strength}`;
        } else if (this.type === 'accessory') {
            typeInfo = this.item.category;
        }
        
        const info = createElement('p', {
            className: 'item-info',
            textContent: typeInfo
        });

        // Rating and comments
        const footer = createElement('div', { className: 'item-footer' });
        
        const ratingContainer = createElement('div', { className: 'item-rating' });
        new StarRating(ratingContainer, {
            rating: this.item.average_rating || 0,
            count: this.item.rating_count || 0
        });
        
        const comments = createElement('span', {
            className: 'item-comments',
            textContent: `${this.item.comment_count || 0} comments`
        });

        footer.appendChild(ratingContainer);
        footer.appendChild(comments);

        content.appendChild(title);
        content.appendChild(brand);
        content.appendChild(info);
        content.appendChild(footer);

        link.appendChild(imageContainer);
        link.appendChild(content);
        card.appendChild(link);

        return card;
    }
}

window.ItemCard = ItemCard;
```

Create `js/components/Pagination.js`:

```javascript
class Pagination {
    constructor(container, options = {}) {
        this.container = container;
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 1;
        this.onPageChange = options.onPageChange;
        
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        
        if (this.totalPages <= 1) return;

        this.container.className = 'pagination';

        // Previous button
        if (this.currentPage > 1) {
            const prevButton = createElement('button', {
                className: 'pagination-btn',
                textContent: 'Previous',
                onclick: () => this.goToPage(this.currentPage - 1)
            });
            this.container.appendChild(prevButton);
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        if (startPage > 1) {
            this.container.appendChild(this.createPageButton(1));
            if (startPage > 2) {
                this.container.appendChild(createElement('span', {
                    className: 'pagination-ellipsis',
                    textContent: '...'
                }));
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            this.container.appendChild(this.createPageButton(i));
        }

        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                this.container.appendChild(createElement('span', {
                    className: 'pagination-ellipsis',
                    textContent: '...'
                }));
            }
            this.container.appendChild(this.createPageButton(this.totalPages));
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            const nextButton = createElement('button', {
                className: 'pagination-btn',
                textContent: 'Next',
                onclick: () => this.goToPage(this.currentPage + 1)
            });
            this.container.appendChild(nextButton);
        }
    }

    createPageButton(pageNumber) {
        return createElement('button', {
            className: `pagination-btn ${pageNumber === this.currentPage ? 'active' : ''}`,
            textContent: pageNumber,
            onclick: () => this.goToPage(pageNumber)
        });
    }

    goToPage(page) {
        if (page !== this.currentPage && this.onPageChange) {
            this.onPageChange(page);
        }
    }

    update(currentPage, totalPages) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.render();
    }
}

window.Pagination = Pagination;
```

### 6. Pages

Create `js/pages/PipesPage.js`:

```javascript
class PipesPage {
    constructor() {
        this.filters = {
            page: 1,
            limit: 20,
            search: '',
            brand: '',
            country: ''
        };
        this.pipes = null;
        this.pagination = null;
    }

    async render() {
        const container = $('#content');
        container.innerHTML = '';

        const pageHeader = createElement('div', { className: 'page-header' });
        const title = createElement('h1', {
            className: 'page-title',
            textContent: 'Pipe Collection'
        });
        pageHeader.appendChild(title);

        const pageContent = createElement('div', { className: 'page-content' });
        
        // Filters sidebar
        const sidebar = createElement('div', { className: 'filters-sidebar' });
        sidebar.appendChild(this.renderFilters());

        // Main content area
        const mainContent = createElement('div', { className: 'main-content' });
        
        // Search bar
        const searchContainer = createElement('div', { className: 'search-container' });
        const searchInput = createElement('input', {
            type: 'text',
            placeholder: 'Search pipes...',
            className: 'search-input',
            value: this.filters.search
        });
        
        searchInput.addEventListener('input', debounce((e) => {
            this.filters.search = e.target.value;
            this.filters.page = 1;
            this.loadPipes();
        }, 300));

        searchContainer.appendChild(searchInput);
        mainContent.appendChild(searchContainer);

        // Items grid
        const itemsGrid = createElement('div', {
            className: 'items-grid',
            id: 'pipes-grid'
        });
        mainContent.appendChild(itemsGrid);

        // Pagination
        const paginationContainer = createElement('div', {
            className: 'pagination-container',
            id: 'pipes-pagination'
        });
        mainContent.appendChild(paginationContainer);

        pageContent.appendChild(sidebar);
        pageContent.appendChild(mainContent);

        container.appendChild(pageHeader);
        container.appendChild(pageContent);

        // Load pipes data
        await this.loadPipes();
    }

    renderFilters() {
        const filtersContainer = createElement('div', { className: 'filters' });
        
        const filtersTitle = createElement('h3', {
            className: 'filters-title',
            textContent: 'Filters'
        });
        filtersContainer.appendChild(filtersTitle);

        // Brand filter
        const brandFilter = createElement('div', { className: 'filter-group' });
        const brandLabel = createElement('label', {
            className: 'filter-label',
            textContent: 'Brand'
        });
        const brandSelect = createElement('select', {
            className: 'filter-select',
            id: 'brand-filter'
        });
        
        brandSelect.appendChild(createElement('option', {
            value: '',
            textContent: 'All Brands'
        }));

        brandSelect.addEventListener('change', (e) => {
            this.filters.brand = e.target.value;
            this.filters.page = 1;
            this.loadPipes();
        });

        brandFilter.appendChild(brandLabel);
        brandFilter.appendChild(brandSelect);

        // Country filter
        const countryFilter = createElement('div', { className: 'filter-group' });
        const countryLabel = createElement('label', {
            className: 'filter-label',
            textContent: 'Country'
        });
        const countrySelect = createElement('select', {
            className: 'filter-select',
            id: 'country-filter'
        });
        
        countrySelect.appendChild(createElement('option', {
            value: '',
            textContent: 'All Countries'
        }));

        countrySelect.addEventListener('change', (e) => {
            this.filters.country = e.target.value;
            this.filters.page = 1;
            this.loadPipes();
        });

        countryFilter.appendChild(countryLabel);
        countryFilter.appendChild(countrySelect);

        filtersContainer.appendChild(brandFilter);
        filtersContainer.appendChild(countryFilter);

        return filtersContainer;
    }

    async loadPipes() {
        try {
            showLoading();
            
            const response = await CollectionService.getPipes(this.filters);
            this.pipes = response.data;
            
            this.renderPipes();
            this.renderPagination(response.meta.pagination);
            this.updateFilters(response.meta.filters);
            
            hideLoading();
        } catch (error) {
            showError(`Failed to load pipes: ${error.message}`);
        }
    }

    renderPipes() {
        const grid = $('#pipes-grid');
        grid.innerHTML = '';

        if (!this.pipes || this.pipes.length === 0) {
            const noResults = createElement('div', {
                className: 'no-results',
                textContent: 'No pipes found matching your criteria.'
            });
            grid.appendChild(noResults);
            return;
        }

        this.pipes.forEach(pipe => {
            const itemCard = new ItemCard(pipe, 'pipe');
            grid.appendChild(itemCard.render());
        });
    }

    renderPagination(paginationData) {
        const container = $('#pipes-pagination');
        
        if (this.pagination) {
            this.pagination.update(paginationData.current_page, paginationData.total_pages);
        } else {
            this.pagination = new Pagination(container, {
                currentPage: paginationData.current_page,
                totalPages: paginationData.total_pages,
                onPageChange: (page) => {
                    this.filters.page = page;
                    this.loadPipes();
                }
            });
        }
    }

    updateFilters(filtersData) {
        if (!filtersData) return;

        // Update brand options
        const brandSelect = $('#brand-filter');
        const currentBrand = brandSelect.value;
        brandSelect.innerHTML = '<option value="">All Brands</option>';
        
        if (filtersData.available_brands) {
            filtersData.available_brands.forEach(brand => {
                const option = createElement('option', {
                    value: brand,
                    textContent: brand,
                    selected: brand === currentBrand
                });
                brandSelect.appendChild(option);
            });
        }

        // Update country options
        const countrySelect = $('#country-filter');
        const currentCountry = countrySelect.value;
        countrySelect.innerHTML = '<option value="">All Countries</option>';
        
        if (filtersData.available_countries) {
            filtersData.available_countries.forEach(country => {
                const option = createElement('option', {
                    value: country,
                    textContent: country,
                    selected: country === currentCountry
                });
                countrySelect.appendChild(option);
            });
        }
    }
}

window.PipesPage = PipesPage;
```

### 7. Router

Create `js/router.js`:

```javascript
class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        
        // Initialize routes
        this.initRoutes();
        
        // Handle navigation
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => this.handleLinkClick(e));
        
        // Handle initial route
        this.handleRoute();
    }

    initRoutes() {
        this.routes.set('home', {
            path: '/',
            component: () => new HomePage()
        });
        
        this.routes.set('pipes', {
            path: '/pipes',
            component: () => new PipesPage()
        });
        
        this.routes.set('pipe-detail', {
            path: '/pipes/:id',
            component: (params) => new PipeDetailPage(params.id)
        });
        
        this.routes.set('tobaccos', {
            path: '/tobaccos',
            component: () => new TobaccosPage()
        });
        
        this.routes.set('search', {
            path: '/search',
            component: () => new SearchPage()
        });
    }

    handleLinkClick(e) {
        const link = e.target.closest('a[data-route]');
        if (!link || link.target === '_blank') return;
        
        e.preventDefault();
        
        const route = link.dataset.route;
        const path = link.getAttribute('href');
        
        this.navigate(path, { route });
    }

    navigate(path, state = {}) {
        window.history.pushState(state, '', path);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const params = this.extractParams(path);
        
        // Find matching route
        let matchedRoute = null;
        let routeParams = {};
        
        for (const [routeName, route] of this.routes) {
            const match = this.matchPath(path, route.path);
            if (match) {
                matchedRoute = route;
                routeParams = match.params;
                break;
            }
        }
        
        if (!matchedRoute) {
            this.show404();
            return;
        }
        
        try {
            // Create and render page component
            this.currentPage = matchedRoute.component(routeParams);
            await this.currentPage.render();
        } catch (error) {
            console.error('Route rendering failed:', error);
            showError(`Failed to load page: ${error.message}`);
        }
    }

    matchPath(path, routePath) {
        const pathParts = path.split('/').filter(Boolean);
        const routeParts = routePath.split('/').filter(Boolean);
        
        if (pathParts.length !== routeParts.length) {
            return null;
        }
        
        const params = {};
        
        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const pathPart = pathParts[i];
            
            if (routePart.startsWith(':')) {
                params[routePart.slice(1)] = pathPart;
            } else if (routePart !== pathPart) {
                return null;
            }
        }
        
        return { params };
    }

    extractParams(path) {
        const url = new URL(path, window.location.origin);
        return Object.fromEntries(url.searchParams);
    }

    show404() {
        const container = $('#content');
        container.innerHTML = `
            <div class="error-page">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" data-route="home" class="btn btn-primary">Go Home</a>
            </div>
        `;
    }
}

window.Router = Router;
```

### 8. Main Application

Create `js/app.js`:

```javascript
class App {
    constructor() {
        this.router = null;
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('Pipes Collection App starting...');
        
        // Initialize router
        this.router = new Router();
        
        // Set up global error handling
        this.setupErrorHandling();
        
        // Set up retry functionality
        this.setupRetry();
        
        console.log('App initialized successfully');
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            showError('An unexpected error occurred. Please try again.');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            showError('An unexpected error occurred. Please try again.');
            e.preventDefault();
        });
    }

    setupRetry() {
        $('#retry-button').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// Start the application
new App();
```

### 9. CSS Styles

Create `css/main.css`:

```css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

/* Utility classes */
.hidden {
    display: none !important;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Navigation */
.navbar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-menu a:hover {
    color: #2563eb;
}

/* Main content */
main {
    min-height: calc(100vh - 140px);
    padding: 2rem 0;
}

.page-header {
    margin-bottom: 2rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1f2937;
    text-align: center;
    margin-bottom: 1rem;
}

.page-content {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Loading spinner */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error messages */
.error-message {
    text-align: center;
    padding: 4rem;
    color: #dc2626;
}

.error-page {
    text-align: center;
    padding: 4rem;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #2563eb;
    color: white;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

/* Footer */
.footer {
    background-color: #1f2937;
    color: white;
    padding: 2rem 0;
    margin-top: auto;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
    .page-content {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .nav-container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        gap: 1rem;
    }
}
```

This vanilla JavaScript implementation provides a complete foundation for building a frontend without any frameworks, demonstrating how to interact with the Pipes & Tobacco Collection API using only modern web standards.