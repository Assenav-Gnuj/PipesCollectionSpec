import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';

interface ImageWithItem {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  isFeatured: boolean;
  altText: string;
  sortOrder: number;
  itemType: string;
  itemId: string;
  createdAt: string;
  item?: {
    id: string;
    name: string;
  };
}

interface AdminImagesProps {
  images: ImageWithItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stats: {
    totalImages: number;
    totalSize: number;
    byType: {
      pipe: number;
      tobacco: number;
      accessory: number;
    };
  };
}

export default function AdminImages({ images, totalCount, currentPage, totalPages, stats }: AdminImagesProps) {
  const [filter, setFilter] = useState<'all' | 'pipe' | 'tobacco' | 'accessory'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta imagem permanentemente?')) {
      try {
        const response = await fetch(`/api/admin/images/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert('Erro ao excluir imagem');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Erro ao excluir imagem');
      }
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/images/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Erro ao alterar status da imagem');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Erro ao alterar status da imagem');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTotalSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getItemTypeLabel = (itemType: string) => {
    const labels: { [key: string]: string } = {
      pipe: 'Cachimbo',
      tobacco: 'Tabaco',
      accessory: 'Acessório',
    };
    return labels[itemType] || itemType;
  };

  const getItemTypeColor = (itemType: string) => {
    const colors: { [key: string]: string } = {
      pipe: 'bg-blue-100 text-blue-800',
      tobacco: 'bg-green-100 text-green-800',
      accessory: 'bg-purple-100 text-purple-800',
    };
    return colors[itemType] || 'bg-gray-100 text-gray-800';
  };

  const getEditUrl = (itemType: string, itemId: string) => {
    const urls: { [key: string]: string } = {
      pipe: `/admin/pipes/${itemId}/edit?tab=images`,
      tobacco: `/admin/tobaccos/${itemId}/edit?tab=images`,
      accessory: `/admin/accessories/${itemId}/edit?tab=images`,
    };
    return urls[itemType] || '#';
  };

  return (
    <AdminLayout title="Gerenciar Imagens">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Imagens</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie todas as imagens da coleção ({totalCount} total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Imagens</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💾</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Espaço Utilizado</p>
              <p className="text-2xl font-semibold text-gray-900">{formatTotalSize(stats.totalSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🪈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cachimbos</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.byType.pipe}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tabacos</p>
              <p className="text-2xl font-semibold text-green-600">{stats.byType.tobacco}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="all">Todos os Tipos</option>
                <option value="pipe">Cachimbos</option>
                <option value="tobacco">Tabacos</option>
                <option value="accessory">Acessórios</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="createdAt">Data de Upload</option>
                <option value="filename">Nome do Arquivo</option>
                <option value="fileSize">Tamanho</option>
                <option value="itemType">Tipo de Item</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Image Preview */}
            <div className="relative aspect-w-16 aspect-h-12">
              <img
                src={`/uploads/${image.filename}`}
                alt={image.altText || image.originalName}
                className="w-full h-48 object-cover"
              />
              {image.isFeatured && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    ⭐ Destaque
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getItemTypeColor(image.itemType)}`}>
                  {getItemTypeLabel(image.itemType)}
                </span>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {image.item?.name || 'Item não encontrado'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {image.originalName}
                </p>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>{image.width}x{image.height}</span>
                <span>{formatFileSize(image.fileSize)}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Link
                    href={getEditUrl(image.itemType, image.itemId)}
                    className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                  >
                    Editar Item
                  </Link>
                  <button
                    onClick={() => handleToggleFeatured(image.id, image.isFeatured)}
                    className="text-amber-600 hover:text-amber-900 text-xs font-medium"
                  >
                    {image.isFeatured ? 'Remover Destaque' : 'Destacar'}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-900 text-xs font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            {currentPage > 1 && (
              <a
                href={`?page=${currentPage - 1}&filter=${filter}&sort=${sortBy}&order=${sortOrder}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={`?page=${currentPage + 1}&filter=${filter}&sort=${sortBy}&order=${sortOrder}`}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próximo
              </a>
            )}
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * 16 + 1}</span> até{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 16, totalCount)}
                </span>{' '}
                de <span className="font-medium">{totalCount}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`?page=${page}&filter=${filter}&sort=${sortBy}&order=${sortOrder}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <span className="text-4xl mb-4 block">🖼️</span>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Nenhuma imagem encontrada'
              : `Nenhuma imagem de ${getItemTypeLabel(filter)} encontrada`
            }
          </p>
        </div>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const page = parseInt(context.query.page as string) || 1;
  const filter = (context.query.filter as string) || 'all';
  const sortBy = (context.query.sort as string) || 'createdAt';
  const sortOrder = (context.query.order as 'asc' | 'desc') || 'desc';
  const limit = 16;
  const skip = (page - 1) * limit;

  let where: any = {};
  
  if (filter !== 'all') {
    where.itemType = filter;
  }

  try {
    const [images, totalCount, totalImages, totalSize, pipeImages, tobaccoImages, accessoryImages] = await Promise.all([
      prisma.image.findMany({
        where,
        include: {
          pipe: { select: { id: true, name: true } },
          tobacco: { select: { id: true, name: true } },
          accessory: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
      prisma.image.count(),
      prisma.image.aggregate({
        _sum: { fileSize: true },
      }),
      prisma.image.count({ where: { itemType: 'pipe' } }),
      prisma.image.count({ where: { itemType: 'tobacco' } }),
      prisma.image.count({ where: { itemType: 'accessory' } }),
    ]);

    const serializedImages = images.map(image => {
      const item = image.pipe || image.tobacco || image.accessory;
      return {
        ...image,
        createdAt: image.createdAt.toISOString(),
        item: item ? { id: item.id, name: item.name } : null,
        pipe: undefined,
        tobacco: undefined,
        accessory: undefined,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      props: {
        images: serializedImages,
        totalCount,
        currentPage: page,
        totalPages,
        stats: {
          totalImages,
          totalSize: totalSize._sum.fileSize || 0,
          byType: {
            pipe: pipeImages,
            tobacco: tobaccoImages,
            accessory: accessoryImages,
          },
        },
      },
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      props: {
        images: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        stats: {
          totalImages: 0,
          totalSize: 0,
          byType: {
            pipe: 0,
            tobacco: 0,
            accessory: 0,
          },
        },
      },
    };
  }
};