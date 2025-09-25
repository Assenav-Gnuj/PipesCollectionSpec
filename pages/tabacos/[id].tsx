import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../src/components/Layout';
import ImageGallery from '../../src/components/ImageGallery';
import RatingStars from '../../src/components/RatingStars';
import CommentSection from '../../src/components/CommentSection';
import TobaccoProfileChart, { TobaccoProfileBars } from '../../src/components/TobaccoProfileChart';
import { prisma } from '../../src/lib/prisma';

interface TobaccoDetailPageProps {
  tobacco: {
    id: string;
    name: string;
    brand: string;
    blendType: string;
    contents: string;
    cut: string;
    strength: number;
    roomNote: number;
    taste: number;
    observations: string | null;
    createdAt: string;
  };
  images: string[];
  averageRating: number;
  totalRatings: number;
}

export default function TobaccoDetailPage({ 
  tobacco, 
  images, 
  averageRating, 
  totalRatings 
}: TobaccoDetailPageProps) {
  const router = useRouter();

  const handleRating = async (rating: number) => {
    try {
      const response = await fetch(`/api/tobacco/${tobacco.id}/rating`, {
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
      title={`${tobacco.name} - ${tobacco.brand} | Pipes & Tobacco Collection`}
      description={`Detalhes do tabaco ${tobacco.name} da marca ${tobacco.brand}. Tipo: ${tobacco.blendType}, Conteúdo: ${tobacco.contents}, Corte: ${tobacco.cut}.`}
      keywords={`${tobacco.name}, ${tobacco.brand}, tabaco, ${tobacco.blendType}, ${tobacco.contents}, ${tobacco.cut}`}
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
                    <Link href="/tabacos" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Tabacos
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-900">{tobacco.name}</span>
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
                alt={`${tobacco.name} - ${tobacco.brand}`}
                showThumbnails={true}
                className="sticky top-8"
              />
            </div>

            {/* Tobacco Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {tobacco.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {tobacco.brand}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {tobacco.id}
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
                    Avalie este tabaco:
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
                  Especificações do Tabaco
                </h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.id}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Brand</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.brand}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.name}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Blend Type</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.blendType}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Contents</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.contents}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Cut</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {tobacco.cut}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Tobacco Profile */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Tobacco Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <TobaccoProfileChart
                      strength={tobacco.strength}
                      taste={tobacco.taste}
                      aroma={tobacco.taste} // Using taste as aroma since aroma field doesn't exist
                      room_note={tobacco.roomNote}
                      size="md"
                      showLabels={true}
                      showValues={false}
                    />
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <TobaccoProfileBars
                      strength={tobacco.strength}
                      taste={tobacco.taste}
                      aroma={tobacco.taste} // Using taste as aroma since aroma field doesn't exist
                      room_note={tobacco.roomNote}
                      size="md"
                      showValues={true}
                    />
                  </div>
                </div>

                {/* Profile Legend */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Escala de Avaliação</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium text-red-600">Strength (Força):</span>
                      <br />1-3: Mild | 4-6: Medium | 7-9: Strong
                    </div>
                    <div>
                      <span className="font-medium text-amber-600">Taste (Sabor):</span>
                      <br />1-3: Sutil | 4-6: Balanceado | 7-9: Intenso
                    </div>
                    <div>
                      <span className="font-medium text-blue-600">Room Note:</span>
                      <br />1-3: Discreto | 4-6: Agradável | 7-9: Marcante
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              {tobacco.observations && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Observations
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {tobacco.observations}
                    </p>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <div className="border-t border-gray-200 pt-6">
                <Link
                  href="/tabacos"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar para os Tabacos
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <CommentSection
              itemType="tobacco"
              itemId={tobacco.id}
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
    // Fetch tobacco details
    const tobacco = await prisma.tobacco.findUnique({
      where: { id },
    });

    if (!tobacco || !tobacco.isActive) {
      return { notFound: true };
    }

    // Fetch tobacco images
    const images = await prisma.image.findMany({
      where: {
        itemId: id,
        itemType: 'tobacco',
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
        itemType: 'tobacco',
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
      imageUrls.push('/images/placeholder-tobacco.jpg');
    }

    return {
      props: {
        tobacco: {
          ...tobacco,
          createdAt: tobacco.createdAt.toISOString(),
        },
        images: imageUrls,
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings: ratings.length,
      },
    };
  } catch (error) {
    console.error('Error fetching tobacco details:', error);
    return { notFound: true };
  }
};