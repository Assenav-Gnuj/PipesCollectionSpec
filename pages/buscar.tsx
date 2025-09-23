import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import { ItemGrid } from '../src/components/ItemCard';
import SearchBox from '../src/components/SearchBox';

interface SearchResult {
  id: string;
  name: string;
  manufacturer: string;
  type: 'pipe' | 'tobacco' | 'accessory';
  images: string[];
  description?: string;
  averageRating: number;
  totalRatings: number;
  category?: string;
  brand?: string;
  shape?: string;
  blendType?: string;
}

interface SearchFilters {
  type: string[];
  brands: string[];
  categories: string[];
  sortBy: string;
  sortOrder: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    brands: [],
    categories: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Popular search terms
  const popularSearches = [
    'Peterson', 'Savinelli', 'Dunhill', 'Virginia', 'English', 'Aromatic',
    'Bent', 'Straight', 'Bulldog', 'Dublin', 'Isqueiros', 'Ferramentas'
  ];

  // Available filters
  const availableFilters = {
    types: [
      { value: 'pipe', label: 'Cachimbos' },
      { value: 'tobacco', label: 'Tabacos' },
      { value: 'accessory', label: 'Acessórios' },
    ],
    brands: [
      'Peterson', 'Savinelli', 'Dunhill', 'Stanwell', 'Brigham', 'Chacom',
      'Cornell & Diehl', 'McClelland', 'Samuel Gawith', 'Esoterica', 'Zippo', 'Colibri'
    ],
    categories: [
      'Bent', 'Straight', 'Bulldog', 'Dublin', 'Virginia', 'English', 'Aromatic',
      'Isqueiros', 'Ferramentas', 'Limpeza', 'Armazenamento'
    ],
  };

  // Initialize search from URL params
  useEffect(() => {
    const urlQuery = router.query.q as string;
    const urlType = router.query.type as string;
    const urlPage = parseInt(router.query.page as string) || 1;

    if (urlQuery) {
      setQuery(urlQuery);
      if (urlType && availableFilters.types.some(t => t.value === urlType)) {
        setFilters(prev => ({ ...prev, type: [urlType] }));
      }
      setCurrentPage(urlPage);
      performSearch(urlQuery, urlPage, filters);
    }
  }, [router.query]);

  // Perform search
  const performSearch = async (searchQuery: string, page: number = 1, searchFilters: SearchFilters = filters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: itemsPerPage.toString(),
        sortBy: searchFilters.sortBy,
        sortOrder: searchFilters.sortOrder,
      });

      // Add filter params
      if (searchFilters.type.length > 0) {
        queryParams.append('types', searchFilters.type.join(','));
      }
      if (searchFilters.brands.length > 0) {
        queryParams.append('brands', searchFilters.brands.join(','));
      }
      if (searchFilters.categories.length > 0) {
        queryParams.append('categories', searchFilters.categories.join(','));
      }

      const response = await fetch(`/api/search?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.results);
      setTotalResults(data.total);
      setSuggestions(data.suggestions || []);

      // Update URL
      const urlParams = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
      });
      if (searchFilters.type.length > 0) {
        urlParams.append('type', searchFilters.type[0]);
      }

      router.push(
        {
          pathname: router.pathname,
          query: Object.fromEntries(urlParams.entries()),
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    performSearch(searchQuery, 1);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters };
    const currentArray = newFilters[filterType] as string[];
    
    if (currentArray.includes(value)) {
      newFilters[filterType] = currentArray.filter(item => item !== value) as any;
    } else {
      newFilters[filterType] = [...currentArray, value] as any;
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
    performSearch(query, 1, newFilters);
  };

  // Handle sort change
  const handleSortChange = (sortBy: string, sortOrder: string) => {
    const newFilters = { ...filters, sortBy, sortOrder };
    setFilters(newFilters);
    performSearch(query, currentPage, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      type: [],
      brands: [],
      categories: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    if (query) {
      performSearch(query, 1, clearedFilters);
    }
  };

  const activeFiltersCount = filters.type.length + filters.brands.length + filters.categories.length;
  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <Layout
      title={hasQuery ? `Busca: ${query} - Pipes & Tobacco Collection` : 'Buscar - Pipes & Tobacco Collection'}
      description={hasQuery ? `Resultados da busca por "${query}" em nossa coleção` : 'Busque por cachimbos, tabacos e acessórios em nossa coleção'}
      keywords="busca, pesquisa, cachimbos, tabacos, acessórios, coleção"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {hasQuery ? `Resultados para "${query}"` : 'Buscar na Coleção'}
              </h1>
              {hasQuery && (
                <p className="text-gray-600">
                  {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              )}
            </div>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
                placeholder="Digite o nome, marca ou categoria..."
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!hasQuery ? (
            /* No Query State */
            <div className="text-center py-12">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Busque por qualquer item da nossa coleção</h2>
                <p className="text-gray-600 mb-8">
                  Use termos como marca, nome, categoria ou qualquer característica que você procura
                </p>
                
                {/* Popular Searches */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Buscas populares:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, type: ['pipe'] }));
                    handleSearch('cachimbos');
                  }}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-blue-600 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cachimbos</h3>
                  <p className="text-gray-600 text-sm">Explore nossa coleção de cachimbos</p>
                </button>

                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, type: ['tobacco'] }));
                    handleSearch('tabacos');
                  }}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-green-600 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tabacos</h3>
                  <p className="text-gray-600 text-sm">Descubra blends únicos</p>
                </button>

                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, type: ['accessory'] }));
                    handleSearch('acessórios');
                  }}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-purple-600 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Acessórios</h3>
                  <p className="text-gray-600 text-sm">Encontre acessórios essenciais</p>
                </button>
              </div>
            </div>
          ) : (
            /* Results State */
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">Você quis dizer:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full hover:bg-blue-300 transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters and Sort */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Limpar ({activeFiltersCount})
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Type Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo</h4>
                        <div className="space-y-2">
                          {availableFilters.types.map((type) => (
                            <label key={type.value} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.type.includes(type.value)}
                                onChange={() => handleFilterChange('type', type.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Brand Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Marcas</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableFilters.brands.map((brand) => (
                            <label key={brand} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => handleFilterChange('brands', brand)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="flex-1">
                  {/* Sort Options */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </div>
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        handleSortChange(sortBy, sortOrder);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="relevance-desc">Mais Relevante</option>
                      <option value="name-asc">Nome (A-Z)</option>
                      <option value="name-desc">Nome (Z-A)</option>
                      <option value="brand-asc">Marca (A-Z)</option>
                      <option value="rating-desc">Melhor Avaliação</option>
                      <option value="createdAt-desc">Mais Recentes</option>
                    </select>
                  </div>

                  {/* Results Grid */}
                  <div className="mb-8">
                    <ItemGrid
                      items={results}
                      itemType="pipe"
                      size="md"
                      showPrice={false}
                      showRating={true}
                      showDescription={true}
                      loading={loading}
                      emptyMessage={`Nenhum resultado encontrado para "${query}". Tente usar outros termos de busca.`}
                    />
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próximo
                        </button>
                      </div>
                      
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">
                              {Math.min((currentPage - 1) * itemsPerPage + 1, totalResults)}
                            </span>{' '}
                            até{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * itemsPerPage, totalResults)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{totalResults}</span> resultados
                          </p>
                        </div>
                        
                        <div>
                          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1 || loading}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Anterior</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                              if (page > totalPages) return null;
                              
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  disabled={loading}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    page === currentPage
                                      ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {page}
                                </button>
                              );
                            })}

                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages || loading}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Próximo</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          aria-label="Voltar ao topo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </Layout>
  );
}