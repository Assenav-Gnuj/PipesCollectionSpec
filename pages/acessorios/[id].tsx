import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../src/components/Layout';
import ImageGallery from '../../src/components/ImageGallery';
import RatingStars from '../../src/components/RatingStars';
import CommentSection from '../../src/components/CommentSection';
import { prisma } from '../../src/lib/prisma';

interface AccessoryDetailPageProps {
  accessory: any;
  images: any[];
  ratings: any[];
  comments: any[];
  relatedAccessories: any[];
}

export default function AccessoryDetailPage({
  accessory,
  images,
  ratings,
  comments,
  relatedAccessories,
}: AccessoryDetailPageProps) {
  const router = useRouter();
  
  if (router.isFallback) {
    return (
      <Layout title="Carregando...">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando acessório...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!accessory) {
    return (
      <Layout title="Acessório não encontrado">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acessório não encontrado</h1>
            <p className="text-gray-600 mb-6">O acessório que você está procurando não existe.</p>
            <Link
              href="/acessorios"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Voltar aos Acessórios
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  const galleryImages = images.map(img => `/api/images/${img.filename}`);

  // Breadcrumb structure
  const breadcrumbs = [
    { label: 'Início', href: '/' },
    { label: 'Acessórios', href: '/acessorios' },
    { label: accessory.name, href: `/acessorios/${accessory.id}` },
  ];

  return (
    <Layout
      title={`${accessory.name} - ${accessory.brand} | Acessórios`}
      description={accessory.description || `${accessory.name} da marca ${accessory.brand} - ${accessory.category}`}
      keywords={`${accessory.name}, ${accessory.brand}, ${accessory.category}, acessórios, cachimbo`}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                {breadcrumbs.map((item, index) => (
                  <li key={item.href}>
                    <div className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-gray-400 mr-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                      )}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-sm font-medium text-gray-500">
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <ImageGallery 
                images={galleryImages}
                alt={accessory.name}
                className="sticky top-8"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {accessory.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {accessory.brand}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <RatingStars rating={averageRating} size="lg" />
                <span className="text-sm text-gray-600">
                  {ratings.length > 0 
                    ? `${ratings.length} ${ratings.length === 1 ? 'avaliação' : 'avaliações'}`
                    : 'Nenhuma avaliação'
                  }
                </span>
              </div>

              {/* Description */}
              {accessory.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {accessory.description}
                  </p>
                </div>
              )}

              {/* Category Badge */}
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {accessory.category}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      // Scroll to rating section
                      const ratingSection = document.getElementById('rating-section');
                      if (ratingSection) {
                        ratingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Avaliar Acessório
                  </button>
                  
                  <button
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: accessory.name,
                          text: `Confira este acessório: ${accessory.name} da ${accessory.brand}`,
                          url: window.location.href,
                        });
                      } else {
                        // Fallback to copy link
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copiado para a área de transferência!');
                      }
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="text-gray-900">#{accessory.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Marca:</span>
                  <span className="text-gray-900">{accessory.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Nome:</span>
                  <span className="text-gray-900">{accessory.name}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Categoria:</span>
                  <span className="text-gray-900">{accessory.category}</span>
                </div>
                {accessory.material && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Material:</span>
                    <span className="text-gray-900">{accessory.material}</span>
                  </div>
                )}
                {accessory.color && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Cor:</span>
                    <span className="text-gray-900">{accessory.color}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Observations */}
          {accessory.observations && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-amber-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Observações do Administrador
              </h3>
              <p className="text-amber-700 leading-relaxed">
                {accessory.observations}
              </p>
            </div>
          )}

          {/* Rating and Comments Section */}
          <div id="rating-section" className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações e Comentários</h2>
            
            <CommentSection
              itemId={accessory.id}
              itemType="accessory"
            />
          </div>

          {/* Related Accessories */}
          {relatedAccessories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Acessórios Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedAccessories.map((related) => (
                  <Link 
                    key={related.id} 
                    href={`/acessorios/${related.id}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                        {related.image ? (
                          <Image
                            src={related.image}
                            alt={related.name}
                            width={200}
                            height={150}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{related.brand}</p>
                        <div className="mt-2 flex items-center">
                          <RatingStars rating={related.averageRating} size="sm" />
                          <span className="text-xs text-gray-500 ml-2">
                            ({related.totalRatings})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const accessories = await prisma.accessory.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const paths = accessories.map((accessory) => ({
      params: { id: accessory.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const accessoryId = params?.id as string;

    if (!accessoryId) {
      return {
        notFound: true,
      };
    }

    // Fetch accessory details
    const accessory = await prisma.accessory.findFirst({
      where: {
        id: accessoryId,
        isActive: true,
      },
    });

    if (!accessory) {
      return {
        notFound: true,
      };
    }

    // Fetch related data
    const [images, ratings, comments, relatedAccessories] = await Promise.all([
      // Images
      prisma.image.findMany({
        where: {
          itemId: accessoryId,
          itemType: 'accessory',
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'asc' },
        ],
      }),

      // Ratings
      prisma.rating.findMany({
        where: {
          itemId: accessoryId,
          itemType: 'accessory',
        },
        select: {
          rating: true,
        },
      }),

      // Comments
      prisma.comment.findMany({
        where: {
          itemId: accessoryId,
          itemType: 'accessory',
          isApproved: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          content: true,
          authorName: true,
          createdAt: true,
        },
      }),

      // Related accessories (same category, different accessory)
      prisma.accessory.findMany({
        where: {
          category: accessory.category,
          id: { not: accessoryId },
          isActive: true,
        },
        take: 4,
        select: {
          id: true,
          name: true,
          brand: true,
        },
      }),
    ]);

    // Get ratings and images for related accessories
    const relatedIds = relatedAccessories.map(a => a.id);
    const [relatedRatings, relatedImages] = await Promise.all([
      prisma.rating.findMany({
        where: {
          itemId: { in: relatedIds },
          itemType: 'accessory',
        },
        select: {
          itemId: true,
          rating: true,
        },
      }),
      prisma.image.findMany({
        where: {
          itemId: { in: relatedIds },
          itemType: 'accessory',
          isFeatured: true,
        },
        select: {
          itemId: true,
          filename: true,
        },
      }),
    ]);

    // Transform related accessories data
    const transformedRelatedAccessories = relatedAccessories.map((related) => {
      const relatedAccessoryRatings = relatedRatings.filter(r => r.itemId === related.id);
      const relatedImage = relatedImages.find(img => img.itemId === related.id);
      
      return {
        ...related,
        averageRating: relatedAccessoryRatings.length > 0 
          ? relatedAccessoryRatings.reduce((sum, r) => sum + r.rating, 0) / relatedAccessoryRatings.length 
          : 0,
        totalRatings: relatedAccessoryRatings.length,
        image: relatedImage ? `/api/images/${relatedImage.filename}` : null,
      };
    });

    return {
      props: {
        accessory: {
          ...accessory,
          createdAt: accessory.createdAt.toISOString(),
          updatedAt: accessory.updatedAt.toISOString(),
        },
        images,
        ratings,
        comments: comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
        })),
        relatedAccessories: transformedRelatedAccessories,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching accessory details:', error);
    
    return {
      notFound: true,
    };
  }
};