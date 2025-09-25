import { useState, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterPanelProps {
  itemType: 'pipe' | 'tobacco' | 'accessory';
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
  className?: string;
  isCollapsible?: boolean;
}

export default function FilterPanel({
  itemType,
  onFiltersChange,
  initialFilters = {},
  className = '',
  isCollapsible = true
}: FilterPanelProps) {
  
  const [isOpen, setIsOpen] = useState(!isCollapsible);
  const [filters, setFilters] = useState({
    search: '',
    brands: [] as string[],
    categories: [] as string[],
    priceRange: { min: 0, max: 5000 } as PriceRange,
    inStock: false,
    rating: 0,
    sortBy: 'name',
    sortOrder: 'asc',
    ...initialFilters
  });

  // Filter options based on item type
  const getFilterOptions = () => {
    switch (itemType) {
      case 'pipe':
        return {
          brands: [
            { value: 'dunhill', label: 'Dunhill', count: 25 },
            { value: 'peterson', label: 'Peterson', count: 18 },
            { value: 'savinelli', label: 'Savinelli', count: 22 },
            { value: 'stanwell', label: 'Stanwell', count: 15 },
            { value: 'chacom', label: 'Chacom', count: 12 }
          ],
          categories: [
            { value: 'straight', label: 'Straight', count: 35 },
            { value: 'bent', label: 'Bent', count: 28 },
            { value: 'churchwarden', label: 'Churchwarden', count: 8 },
            { value: 'calabash', label: 'Calabash', count: 5 },
            { value: 'freehand', label: 'Freehand', count: 12 }
          ],
          sortOptions: [
            { value: 'name', label: 'Nome' },
            { value: 'brand', label: 'Marca' },
            { value: 'price', label: 'Preço' },
            { value: 'rating', label: 'Avaliação' },
            { value: 'createdAt', label: 'Mais recentes' }
          ]
        };
      
      case 'tobacco':
        return {
          brands: [
            { value: 'davidoff', label: 'Davidoff', count: 15 },
            { value: 'captain-black', label: 'Captain Black', count: 12 },
            { value: 'mac-baren', label: 'Mac Baren', count: 18 },
            { value: 'peterson', label: 'Peterson', count: 10 },
            { value: 'dunhill', label: 'Dunhill', count: 8 }
          ],
          categories: [
            { value: 'aromatic', label: 'Aromático', count: 25 },
            { value: 'english', label: 'English', count: 20 },
            { value: 'virginia', label: 'Virginia', count: 18 },
            { value: 'burley', label: 'Burley', count: 12 },
            { value: 'oriental', label: 'Oriental', count: 8 }
          ],
          sortOptions: [
            { value: 'name', label: 'Nome' },
            { value: 'brand', label: 'Marca' },
            { value: 'price', label: 'Preço' },
            { value: 'rating', label: 'Avaliação' },
            { value: 'strength', label: 'Força' },
            { value: 'createdAt', label: 'Mais recentes' }
          ]
        };
      
      case 'accessory':
        return {
          brands: [
            { value: 'zippo', label: 'Zippo', count: 15 },
            { value: 'colibri', label: 'Colibri', count: 8 },
            { value: 'savinelli', label: 'Savinelli', count: 12 },
            { value: 'peterson', label: 'Peterson', count: 6 },
            { value: 'dunhill', label: 'Dunhill', count: 4 }
          ],
          categories: [
            { value: 'lighter', label: 'Isqueiros', count: 20 },
            { value: 'tool', label: 'Ferramentas', count: 15 },
            { value: 'cleaner', label: 'Limpeza', count: 12 },
            { value: 'storage', label: 'Armazenamento', count: 8 },
            { value: 'stand', label: 'Suportes', count: 6 }
          ],
          sortOptions: [
            { value: 'name', label: 'Nome' },
            { value: 'manufacturer', label: 'Fabricante' },
            { value: 'price', label: 'Preço' },
            { value: 'rating', label: 'Avaliação' },
            { value: 'createdAt', label: 'Mais recentes' }
          ]
        };
      
      default:
        return {
          brands: [],
          categories: [],
          sortOptions: [
            { value: 'name', label: 'Nome' },
            { value: 'price', label: 'Preço' },
            { value: 'rating', label: 'Avaliação' },
            { value: 'createdAt', label: 'Mais recentes' }
          ]
        };
    }
  };

  const filterOptions = getFilterOptions();

  // Update filters and notify parent
  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle array filter changes (brands, categories)
  const handleArrayFilterChange = (filterType: 'brands' | 'categories', value: string) => {
    const currentArray = filters[filterType];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    
    updateFilters({
      ...filters,
      [filterType]: newArray
    });
  };

  // Handle price range change
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    updateFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      brands: [],
      categories: [],
      priceRange: { min: 0, max: 5000 },
      inStock: false,
      rating: 0,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    updateFilters(clearedFilters);
  };

  // Count active filters
  const activeFiltersCount = 
    filters.brands.length + 
    filters.categories.length + 
    (filters.priceRange.min > 0 || filters.priceRange.max < 5000 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) + 
    (filters.rating > 0 ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      {isCollapsible && (
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              {activeFiltersCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Filter Content */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              placeholder={`Buscar ${itemType === 'pipe' ? 'cachimbos' : itemType === 'tobacco' ? 'tabacos' : 'acessórios'}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Brands */}
          {filterOptions.brands.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {itemType === 'accessory' ? 'Fabricantes' : 'Marcas'}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.brands.map((brand) => (
                  <label key={brand.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.value)}
                      onChange={() => handleArrayFilterChange('brands', brand.value)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {brand.label}
                      {brand.count && (
                        <span className="text-gray-500 ml-1">({brand.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {filterOptions.categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.categories.map((category) => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.value)}
                      onChange={() => handleArrayFilterChange('categories', category.value)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category.label}
                      {category.count && (
                        <span className="text-gray-500 ml-1">({category.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Preço
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  min="0"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilters({ ...filters, inStock: e.target.checked })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Apenas em estoque
              </span>
            </label>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação mínima
            </label>
            <select
              value={filters.rating}
              onChange={(e) => updateFilters({ ...filters, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value={0}>Qualquer avaliação</option>
              <option value={1}>1+ estrelas</option>
              <option value={2}>2+ estrelas</option>
              <option value={3}>3+ estrelas</option>
              <option value={4}>4+ estrelas</option>
              <option value={5}>5 estrelas</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              >
                {filterOptions.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilters({ ...filters, sortOrder: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Limpar filtros ({activeFiltersCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}