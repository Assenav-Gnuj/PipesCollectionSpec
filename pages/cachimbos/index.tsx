import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import FilterPanel from '../../src/components/FilterPanel';
import { ItemGrid } from '../../src/components/ItemCard';
import { prisma } from '../../src/lib/prisma';

interface PipesPageProps {
  initialPipes: any[];
  totalCount: number;
  initialFilters: any;
}

export default function PipesPage({ 
  initialPipes, 
  totalCount, 
  initialFilters 
}: PipesPageProps) {
  const router = useRouter();
  const [pipes, setPipes] = useState(initialPipes);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(totalCount);
  const [filters, setFilters] = useState(initialFilters);
  
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch pipes based on filters
  const fetchPipes = async (newFilters: any, page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...newFilters,
        brands: Array.isArray(newFilters.brands) ? newFilters.brands.join(',') : '',
        shapes: Array.isArray(newFilters.shapes) ? newFilters.shapes.join(',') : '',
      });

      const response = await fetch(`/api/pipes?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch pipes');
      
      const data = await response.json();
      setPipes(data.pipes);
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
      console.error('Error fetching pipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchPipes(newFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPipes(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout
      title="Cachimbos - Pipes & Tobacco Collection"
      description="Explore nossa coleção de cachimbos artesanais, clássicos e modernos. Filtre por marca, modelo, preço e avaliações."
      keywords="cachimbos, pipes, artesanais, coleção, Dunhill, Peterson, Savinelli"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cachimbos</h1>
                <p className="mt-2 text-gray-600">
                  {totalItems} {totalItems === 1 ? 'cachimbo encontrado' : 'cachimbos encontrados'}
                </p>
              </div>
              
              {/* Quick Sort */}
              <div className="mt-4 md:mt-0">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFiltersChange({ ...filters, sortBy, sortOrder });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                  <option value="brand-asc">Marca (A-Z)</option>
                  <option value="brand-desc">Marca (Z-A)</option>
                  <option value="price-asc">Preço (Menor)</option>
                  <option value="price-desc">Preço (Maior)</option>
                  <option value="rating-desc">Melhor Avaliado</option>
                  <option value="createdAt-desc">Mais Recentes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                itemType="pipe"
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
                isCollapsible={true}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Results */}
              <div className="mb-6">
                <ItemGrid
                  items={pipes}
                  itemType="pipe"
                  size="md"
                  showPrice={false}
                  showRating={true}
                  showDescription={true}
                  loading={loading}
                  emptyMessage="Nenhum cachimbo encontrado com os filtros selecionados."
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
          </div>
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
      search: query.search as string || '',
      brands: query.brands ? (query.brands as string).split(',').filter(Boolean) : [],
      shapes: query.shapes ? (query.shapes as string).split(',').filter(Boolean) : [],
      rating: parseInt(query.rating as string) || 0,
      sortBy: query.sortBy as string || 'name',
      sortOrder: query.sortOrder as string || 'asc',
    };

    // Build where clause
    const where: any = {};
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { shape: { contains: filters.search, mode: 'insensitive' } },
        { observations: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.brands.length > 0) {
      where.brand = { in: filters.brands };
    }

    if (filters.shapes.length > 0) {
      where.shape = { in: filters.shapes };
    }

    // Remove price and inStock filtering since they don't exist in collection

    // Build orderBy clause
    const orderBy: any = {};
    if (filters.sortBy === 'rating') {
      // For rating sort, we'll handle this differently in the query
      orderBy.createdAt = filters.sortOrder;
    } else {
      orderBy[filters.sortBy] = filters.sortOrder;
    }

    // Fetch pipes and total count
    const [pipes, totalCount] = await Promise.all([
      prisma.pipe.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.pipe.count({ where }),
    ]);

    // Get ratings and images separately for the found pipes
    const pipeIds = pipes.map(pipe => pipe.id);
    
    const [ratings, images] = await Promise.all([
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

    // Transform data to match ItemCard interface
    const transformedPipes = pipes.map((pipe) => {
      const pipeRatings = ratings.filter(r => r.itemId === pipe.id);
      const pipeImage = images.find(img => img.itemId === pipe.id);
      
      return {
        id: pipe.id,
        name: pipe.name,
        brand: pipe.brand,
        model: pipe.shape, // Using shape as model since model doesn't exist
        images: pipeImage ? [`/api/images/${pipeImage.filename}`] : [],
        description: pipe.observations || `${pipe.material} - ${pipe.finish}`,
        averageRating: pipeRatings.length > 0 
          ? pipeRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / pipeRatings.length 
          : 0,
        totalRatings: pipeRatings.length,
        category: pipe.shape,
      };
    });

    // Sort by rating if requested
    if (filters.sortBy === 'rating') {
      transformedPipes.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return order * (a.averageRating - b.averageRating);
      });
    }

    return {
      props: {
        initialPipes: transformedPipes,
        totalCount,
        initialFilters: filters,
      },
    };
  } catch (error) {
    console.error('Error fetching pipes:', error);
    
    return {
      props: {
        initialPipes: [],
        totalCount: 0,
        initialFilters: {
          search: '',
          brands: [],
          categories: [],
          priceRange: { min: 0, max: 10000 },
          inStock: false,
          rating: 0,
          sortBy: 'name',
          sortOrder: 'asc',
        },
      },
    };
  }
};