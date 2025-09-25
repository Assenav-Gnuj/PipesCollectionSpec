import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';

interface TobaccosListProps {
  tobaccos: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function AdminTobaccosList({ tobaccos, totalCount, currentPage, totalPages }: TobaccosListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tabaco?')) {
      try {
        const response = await fetch(`/api/admin/tobaccos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert('Erro ao excluir tabaco');
        }
      } catch (error) {
        console.error('Error deleting tobacco:', error);
        alert('Erro ao excluir tabaco');
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/tobaccos/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Erro ao alterar status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Erro ao alterar status');
    }
  };

  const getStrengthLabel = (strength: number) => {
    const labels = ['Muito Suave', 'Suave', 'Médio-Suave', 'Médio', 'Médio-Forte', 'Forte', 'Muito Forte'];
    return labels[strength - 1] || 'N/A';
  };

  return (
    <AdminLayout title="Gerenciar Tabacos">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tabacos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie a coleção de tabacos ({totalCount} total)
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/tobaccos/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="mr-2">➕</span>
            Novo Tabaco
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Buscar</label>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Buscar por nome, marca, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="createdAt">Data de Criação</option>
                <option value="name">Nome</option>
                <option value="brand">Marca</option>
                <option value="blendType">Tipo</option>
                <option value="strength">Força</option>
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

      {/* Tobaccos List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tobaccos.map((tobacco) => (
            <li key={tobacco.id}>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {tobacco.images && tobacco.images.length > 0 ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={tobacco.images[0].url}
                        alt={tobacco.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-2xl">🌿</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tobacco.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tobacco.brand} - {tobacco.blendType}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                        <span>Corte: {tobacco.cut}</span>
                        <span>Força: {getStrengthLabel(tobacco.strength)}</span>
                        <span>Sabor: {tobacco.taste}/10</span>
                        <span>Aroma: {tobacco.roomNote}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tobacco.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tobacco.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(tobacco.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/admin/tobaccos/${tobacco.id}/edit`}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => toggleStatus(tobacco.id, tobacco.isActive)}
                    className="text-amber-600 hover:text-amber-900 text-sm font-medium"
                  >
                    {tobacco.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDelete(tobacco.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            {currentPage > 1 && (
              <a
                href={`?page=${currentPage - 1}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={`?page=${currentPage + 1}`}
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
                    href={`?page=${page}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
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

      {tobaccos.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Nenhum tabaco encontrado</p>
          <Link
            href="/admin/tobaccos/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Adicionar Primeiro Tabaco
          </Link>
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
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const [tobaccos, totalCount] = await Promise.all([
      prisma.tobacco.findMany({
        include: {
          images: {
            take: 1,
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tobacco.count(),
    ]);

    const serializedTobaccos = tobaccos.map(tobacco => ({
      ...tobacco,
      createdAt: tobacco.createdAt.toISOString(),
      updatedAt: tobacco.updatedAt.toISOString(),
      images: tobacco.images.map((img: any) => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
      })),
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      props: {
        tobaccos: serializedTobaccos,
        totalCount,
        currentPage: page,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching tobaccos:', error);
    return {
      props: {
        tobaccos: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
      },
    };
  }
};