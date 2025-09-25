import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import { ItemGrid } from '../../src/components/ItemCard';
import { prisma } from '../../src/lib/prisma';

interface TobaccosPageProps {
  initialTobaccos: any[];
  totalCount: number;
  initialFilters: any;
}

export default function TobaccosPage({ 
  initialTobaccos, 
  totalCount, 
  initialFilters 
}: TobaccosPageProps) {
  const router = useRouter();
  const [tobaccos, setTobaccos] = useState(initialTobaccos);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(totalCount);
  const [filters, setFilters] = useState(initialFilters);
  
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Available brands and blend types for filtering
  const brands = [
    'Davidoff', 'Captain Black', 'Mac Baren', 'Peterson', 'Dunhill',
    'Amphora', 'Cornell & Diehl', 'G.L. Pease', 'Rattray\'s', 'Escudo'
  ];

  const blendTypes = [
    'Aromatic', 'English', 'Virginia', 'Burley', 'Oriental', 'Balkan',
    'Perique', 'Latakia', 'Cavendish', 'Navy Flake'
  ];

  // Fetch tobaccos based on filters
  const fetchTobaccos = async (newFilters: any, page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...newFilters,
        brands: Array.isArray(newFilters.brands) ? newFilters.brands.join(',') : '',
        blendTypes: Array.isArray(newFilters.blendTypes) ? newFilters.blendTypes.join(',') : '',
      });

      const response = await fetch(`/api/tobaccos?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tobaccos');
      
      const data = await response.json();
      setTobaccos(data.tobaccos);
      setTotalItems(data.total);
      
      // Update URL without page reload
      router.push(
        {
          pathname: router.pathname,
          query: Object.fromEntries(queryParams.entries()),
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error('Error fetching tobaccos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType: 'brands' | 'blendTypes', value: string) => {
    const currentArray = filters[filterType];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    
    const newFilters = {
      ...filters,
      [filterType]: newArray
    };
    
    setFilters(newFilters);
    setCurrentPage(1);
    fetchTobaccos(newFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTobaccos(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      brands: [],
      blendTypes: [],
      sortBy: 'name',
      sortOrder: 'asc',
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    fetchTobaccos(clearedFilters, 1);
  };

  const activeFiltersCount = filters.brands.length + filters.blendTypes.length;

  return (
    <Layout
      title="Tabacos - Pipes & Tobacco Collection"
      description="Explore nossa coleção de tabacos para cachimbo. Filtre por marca, tipo de blend e características. Aromáticos, English, Virginia e muito mais."
      keywords="tabacos, pipe tobacco, aromatic, english, virginia, burley, blend"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tabacos</h1>
                <p className="mt-2 text-gray-600">
                  {totalItems} {totalItems === 1 ? 'tabaco encontrado' : 'tabacos encontrados'}
                </p>
              </div>
              
              {/* Quick Sort */}
              <div className="mt-4 md:mt-0">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    const newFilters = { ...filters, sortBy, sortOrder };
                    setFilters(newFilters);
                    fetchTobaccos(newFilters, currentPage);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                  <option value="brand-asc">Marca (A-Z)</option>
                  <option value="brand-desc">Marca (Z-A)</option>
                  <option value="blendType-asc">Tipo (A-Z)</option>
                  <option value="strength-asc">Força (Menor)</option>
                  <option value="strength-desc">Força (Maior)</option>
                  <option value="createdAt-desc">Mais Recentes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Limpar filtros ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Marcas</h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleFilterChange('brands', brand)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Blend Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipos de Blend</h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {blendTypes.map((blendType) => (
                    <label key={blendType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.blendTypes.includes(blendType)}
                        onChange={() => handleFilterChange('blendTypes', blendType)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{blendType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <ItemGrid
              items={tobaccos}
              itemType="tobacco"
              size="md"
              showPrice={false}
              showRating={true}
              showDescription={true}
              loading={loading}
              emptyMessage="Nenhum tabaco encontrado com os filtros selecionados."
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
                      {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                    </span>{' '}
                    até{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium">{totalItems}</span> resultados
                  </p>
                </div>
                
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {/* Previous button */}
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

                    {/* Page numbers */}
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
                              ? 'z-10 bg-amber-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next button */}
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

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors z-40"
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Parse filters from query
    const filters = {
      brands: query.brands ? (query.brands as string).split(',').filter(Boolean) : [],
      blendTypes: query.blendTypes ? (query.blendTypes as string).split(',').filter(Boolean) : [],
      sortBy: query.sortBy as string || 'name',
      sortOrder: query.sortOrder as string || 'asc',
    };

    // Build where clause
    const where: any = {};
    
    if (filters.brands.length > 0) {
      where.brand = { in: filters.brands };
    }

    if (filters.blendTypes.length > 0) {
      where.blendType = { in: filters.blendTypes };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[filters.sortBy] = filters.sortOrder;

    // Fetch tobaccos and total count
    const [tobaccos, totalCount] = await Promise.all([
      prisma.tobacco.findMany({
        where: {
          ...where,
          isActive: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.tobacco.count({ 
        where: {
          ...where,
          isActive: true,
        }
      }),
    ]);

    // Get ratings and images separately for the found tobaccos
    const tobaccoIds = tobaccos.map(tobacco => tobacco.id);
    
    const [ratings, images] = await Promise.all([
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

    // Transform data to match ItemCard interface
    const transformedTobaccos = tobaccos.map((tobacco) => {
      const tobaccoRatings = ratings.filter(r => r.itemId === tobacco.id);
      const tobaccoImage = images.find(img => img.itemId === tobacco.id);
      
      return {
        id: tobacco.id,
        name: tobacco.name,
        brand: tobacco.brand,
        type: tobacco.blendType,
        images: tobaccoImage ? [`/api/images/${tobaccoImage.filename}`] : [],
        description: tobacco.observations || `${tobacco.contents} - ${tobacco.cut}`,
        averageRating: tobaccoRatings.length > 0 
          ? tobaccoRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / tobaccoRatings.length 
          : 0,
        totalRatings: tobaccoRatings.length,
        category: tobacco.blendType,
      };
    });

    return {
      props: {
        initialTobaccos: transformedTobaccos,
        totalCount,
        initialFilters: filters,
      },
    };
  } catch (error) {
    console.error('Error fetching tobaccos:', error);
    
    return {
      props: {
        initialTobaccos: [],
        totalCount: 0,
        initialFilters: {
          brands: [],
          blendTypes: [],
          sortBy: 'name',
          sortOrder: 'asc',
        },
      },
    };
  }
};