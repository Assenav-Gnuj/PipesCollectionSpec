import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';

interface AdminDashboardProps {
  stats: {
    totalPipes: number;
    totalTobaccos: number;
    totalAccessories: number;
    totalComments: number;
    pendingComments: number;
    totalUsers: number;
    recentActivity: any[];
  };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🪈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cachimbos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPipes}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTobaccos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acessórios</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAccessories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comentários</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalComments}</p>
              {stats.pendingComments > 0 && (
                <p className="text-xs text-amber-600 font-medium">
                  {stats.pendingComments} pendentes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/pipes/new"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-2xl mr-3">➕</span>
                <div>
                  <p className="font-medium text-blue-900">Novo Cachimbo</p>
                  <p className="text-sm text-blue-600">Adicionar à coleção</p>
                </div>
              </Link>

              <Link
                href="/admin/tobaccos/new"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl mr-3">➕</span>
                <div>
                  <p className="font-medium text-green-900">Novo Tabaco</p>
                  <p className="text-sm text-green-600">Adicionar blend</p>
                </div>
              </Link>

              <Link
                href="/admin/accessories/new"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-2xl mr-3">➕</span>
                <div>
                  <p className="font-medium text-purple-900">Novo Acessório</p>
                  <p className="text-sm text-purple-600">Adicionar item</p>
                </div>
              </Link>

              <Link
                href="/admin/comments"
                className="flex items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <p className="font-medium text-amber-900">Moderar</p>
                  <p className="text-sm text-amber-600">Comentários pendentes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {stats.recentActivity.map((activity, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== stats.recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <span className="text-sm">{activity.icon}</span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">{activity.description}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Status do Sistema</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600">✅</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Banco de Dados</p>
              <p className="text-xs text-gray-500">Conectado</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600">✅</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Upload de Imagens</p>
              <p className="text-xs text-gray-500">Funcionando</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600">✅</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Sistema de Busca</p>
              <p className="text-xs text-gray-500">Ativo</p>
            </div>
          </div>
        </div>
      </div>
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

  try {
    // Get statistics
    const [
      totalPipes,
      totalTobaccos, 
      totalAccessories,
      totalComments,
      pendingComments,
      totalUsers,
    ] = await Promise.all([
      prisma.pipe.count({ where: { isActive: true } }),
      prisma.tobacco.count({ where: { isActive: true } }),
      prisma.accessory.count({ where: { isActive: true } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    // Get recent activity (simplified for now)
    const recentActivity = [
      {
        description: 'Sistema de administração inicializado',
        icon: '🚀',
        time: 'Agora'
      }
    ];

    const stats = {
      totalPipes,
      totalTobaccos,
      totalAccessories,
      totalComments,
      pendingComments,
      totalUsers,
      recentActivity,
    };

    return {
      props: {
        stats,
      },
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    return {
      props: {
        stats: {
          totalPipes: 0,
          totalTobaccos: 0,
          totalAccessories: 0,
          totalComments: 0,
          pendingComments: 0,
          totalUsers: 0,
          recentActivity: [],
        },
      },
    };
  }
};