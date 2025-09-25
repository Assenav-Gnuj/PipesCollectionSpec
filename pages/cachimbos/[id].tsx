import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../src/components/Layout';
import ImageGallery from '../../src/components/ImageGallery';
import RatingStars from '../../src/components/RatingStars';
import CommentSection from '../../src/components/CommentSection';
import { prisma } from '../../src/lib/prisma';

interface PipeDetailPageProps {
  pipe: {
    id: string;
    name: string;
    brand: string;
    material: string;
    shape: string;
    finish: string;
    filterType: string;
    stemMaterial: string;
    country: string;
    observations: string | null;
    createdAt: string;
  };
  images: string[];
  averageRating: number;
  totalRatings: number;
}

export default function PipeDetailPage({ 
  pipe, 
  images, 
  averageRating, 
  totalRatings 
}: PipeDetailPageProps) {
  const router = useRouter();

  const handleRating = async (rating: number) => {
    try {
      const response = await fetch(`/api/pipe/${pipe.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      // Refresh the page to show updated rating
      router.reload();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  };

  return (
    <Layout
      title={`${pipe.name} - ${pipe.brand} | Pipes & Tobacco Collection`}
      description={`Detalhes do cachimbo ${pipe.name} da marca ${pipe.brand}. Material: ${pipe.material}, Formato: ${pipe.shape}, Acabamento: ${pipe.finish}.`}
      keywords={`${pipe.name}, ${pipe.brand}, cachimbo, ${pipe.material}, ${pipe.shape}, ${pipe.country}`}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Home</span>
                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/cachimbos" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Cachimbos
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-900">{pipe.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery
                images={images}
                alt={`${pipe.name} - ${pipe.brand}`}
                showThumbnails={true}
                className="sticky top-8"
              />
            </div>

            {/* Pipe Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {pipe.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {pipe.brand}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {pipe.id}
                </p>
              </div>

              {/* Rating */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Avaliação
                </h3>
                
                {/* Current Rating Display */}
                <div className="mb-4">
                  <RatingStars
                    rating={averageRating}
                    totalRatings={totalRatings}
                    size="lg"
                    interactive={false}
                  />
                </div>

                {/* Interactive Rating */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Avalie este cachimbo:
                  </p>
                  <RatingStars
                    rating={0}
                    size="md"
                    interactive={true}
                    onRate={handleRating}
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Especificações do Cachimbo
                </h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.id}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Brand</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.brand}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.name}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Material</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.material}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Shape</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.shape}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Finish</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.finish}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Filter</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.filterType}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Stem Material</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.stemMaterial}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Country</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {pipe.country}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Observations */}
              {pipe.observations && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Observations
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {pipe.observations}
                    </p>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <div className="border-t border-gray-200 pt-6">
                <Link
                  href="/cachimbos"
                  className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar para os Cachimbos
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <CommentSection
              itemType="pipe"
              itemId={pipe.id}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  if (!id) {
    return { notFound: true };
  }

  try {
    // Fetch pipe details
    const pipe = await prisma.pipe.findUnique({
      where: { id },
    });

    if (!pipe || !pipe.isActive) {
      return { notFound: true };
    }

    // Fetch pipe images
    const images = await prisma.image.findMany({
      where: {
        itemId: id,
        itemType: 'pipe',
      },
      orderBy: [
        { isFeatured: 'desc' }, // Featured image first
        { sortOrder: 'asc' },   // Then by sort order
        { createdAt: 'asc' },   // Finally by creation date
      ],
      take: 5, // Maximum 5 images as specified
    });

    // Fetch ratings
    const ratings = await prisma.rating.findMany({
      where: {
        itemId: id,
        itemType: 'pipe',
      },
      select: {
        rating: true,
      },
    });

    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    // Transform images to URLs
    const imageUrls = images.map(img => `/api/images/${img.filename}`);
    
    // Add placeholder if no images
    if (imageUrls.length === 0) {
      imageUrls.push('/images/placeholder-pipe.jpg');
    }

    return {
      props: {
        pipe: {
          id: pipe.id,
          name: pipe.name,
          brand: pipe.brand,
          material: pipe.material,
          shape: pipe.shape,
          finish: pipe.finish,
          filterType: pipe.filterType,
          stemMaterial: pipe.stemMaterial,
          country: pipe.country,
          observations: pipe.observations,
          isActive: pipe.isActive,
          createdAt: pipe.createdAt.toISOString(),
          updatedAt: pipe.updatedAt.toISOString(),
        },
        images: imageUrls,
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings: ratings.length,
      },
    };
  } catch (error) {
    console.error('Error fetching pipe details:', error);
    return { notFound: true };
  }
};