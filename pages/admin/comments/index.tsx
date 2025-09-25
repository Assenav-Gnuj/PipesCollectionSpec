import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';

interface CommentsListProps {
  comments: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stats: {
    pending: number;
    approved: number;
    total: number;
  };
}

export default function AdminCommentsList({ comments, totalCount, currentPage, totalPages, stats }: CommentsListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: true }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Erro ao aprovar comentário');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Erro ao aprovar comentário');
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Tem certeza que deseja rejeitar este comentário?')) {
      try {
        const response = await fetch(`/api/admin/comments/${id}/reject`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isApproved: false }),
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert('Erro ao rejeitar comentário');
        }
      } catch (error) {
        console.error('Error rejecting comment:', error);
        alert('Erro ao rejeitar comentário');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este comentário?')) {
      try {
        const response = await fetch(`/api/admin/comments/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert('Erro ao excluir comentário');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Erro ao excluir comentário');
      }
    }
  };

  const handleBulkApprove = async () => {
    const pendingComments = comments.filter(c => !c.isApproved);
    if (pendingComments.length === 0) {
      alert('Não há comentários pendentes para aprovar');
      return;
    }

    if (confirm(`Tem certeza que deseja aprovar ${pendingComments.length} comentários pendentes?`)) {
      try {
        const response = await fetch('/api/admin/comments/bulk-approve', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            commentIds: pendingComments.map(c => c.id) 
          }),
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert('Erro na aprovação em lote');
        }
      } catch (error) {
        console.error('Error bulk approving:', error);
        alert('Erro na aprovação em lote');
      }
    }
  };

  const getItemTypeLabel = (itemType: string) => {
    const labels: { [key: string]: string } = {
      pipe: 'Cachimbo',
      tobacco: 'Tabaco',
      accessory: 'Acessório',
    };
    return labels[itemType] || itemType;
  };

  const getItemUrl = (itemType: string, itemId: string) => {
    const urls: { [key: string]: string } = {
      pipe: `/cachimbos/${itemId}`,
      tobacco: `/tabacos/${itemId}`,
      accessory: `/acessorios/${itemId}`,
    };
    return urls[itemType] || '#';
  };

  return (
    <AdminLayout title="Moderação de Comentários">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moderação de Comentários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie comentários dos usuários ({totalCount} total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprovados</p>
              <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Buscar</label>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Buscar por conteúdo, autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
              </select>
              
              {stats.pending > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Aprovar Todos Pendentes ({stats.pending})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Comment Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        comment.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comment.isApproved ? 'Aprovado' : 'Pendente'}
                    </span>
                    
                    <span className="text-sm text-gray-500">
                      {comment.authorName || 'Anônimo'}
                    </span>
                    
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString('pt-BR')}
                    </span>
                    
                    <Link
                      href={getItemUrl(comment.itemType, comment.itemId)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                      target="_blank"
                    >
                      {getItemTypeLabel(comment.itemType)}
                    </Link>
                  </div>

                  {/* Comment Content */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {/* Moderation Info */}
                  {comment.moderatedBy && comment.moderatedAt && (
                    <div className="mt-3 text-xs text-gray-500">
                      Moderado em {new Date(comment.moderatedAt).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {!comment.isApproved ? (
                    <>
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Rejeitar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="text-amber-600 hover:text-amber-900 text-sm font-medium"
                    >
                      Reprovar
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
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
                href={`?page=${currentPage - 1}&filter=${filter}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={`?page=${currentPage + 1}&filter=${filter}`}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próximo
              </a>
            )}
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> até{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 10, totalCount)}
                </span>{' '}
                de <span className="font-medium">{totalCount}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`?page=${page}&filter=${filter}`}
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

      {comments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {filter === 'pending' 
              ? 'Nenhum comentário pendente encontrado'
              : filter === 'approved'
              ? 'Nenhum comentário aprovado encontrado'
              : 'Nenhum comentário encontrado'
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
  const filter = (context.query.filter as string) || 'pending';
  const limit = 10;
  const skip = (page - 1) * limit;

  let where: any = {};
  
  if (filter === 'pending') {
    where.isApproved = false;
  } else if (filter === 'approved') {
    where.isApproved = true;
  }

  try {
    const [comments, totalCount, pendingCount, approvedCount, allCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.comment.count({ where: { isApproved: true } }),
      prisma.comment.count(),
    ]);

    const serializedComments = comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      moderatedAt: comment.moderatedAt?.toISOString() || null,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      props: {
        comments: serializedComments,
        totalCount,
        currentPage: page,
        totalPages,
        stats: {
          pending: pendingCount,
          approved: approvedCount,
          total: allCount,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      props: {
        comments: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        stats: {
          pending: 0,
          approved: 0,
          total: 0,
        },
      },
    };
  }
};