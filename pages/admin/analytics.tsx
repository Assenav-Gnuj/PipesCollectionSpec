import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';

interface AnalyticsData {
  overview: {
    totalItems: number;
    totalImages: number;
    totalComments: number;
    storageUsed: number;
  };
  growth: {
    thisMonth: {
      pipes: number;
      tobaccos: number;
      accessories: number;
      comments: number;
    };
    lastMonth: {
      pipes: number;
      tobaccos: number;
      accessories: number;
      comments: number;
    };
  };
  distribution: {
    pipes: {
      byBrand: Array<{ brand: string; count: number }>;
      byMaterial: Array<{ material: string; count: number }>;
      byShape: Array<{ shape: string; count: number }>;
    };
    tobaccos: {
      byBrand: Array<{ brand: string; count: number }>;
      byType: Array<{ type: string; count: number }>;
      byStrength: Array<{ strength: string; count: number }>;
    };
    accessories: {
      byCategory: Array<{ category: string; count: number }>;
      byBrand: Array<{ brand: string; count: number }>;
    };
  };
  recent: {
    recentItems: Array<{
      id: string;
      name: string;
      type: 'pipe' | 'tobacco' | 'accessory';
      createdAt: string;
    }>;
    recentComments: Array<{
      id: string;
      content: string;
      itemName: string;
      itemType: string;
      createdAt: string;
      isApproved: boolean;
    }>;
  };
}

interface AdminAnalyticsProps {
  data: AnalyticsData;
}

export default function AdminAnalytics({ data }: AdminAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getGrowthColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getItemTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      pipe: '🪈',
      tobacco: '🌿',
      accessory: '🔧',
    };
    return icons[type] || '📦';
  };

  const getItemTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      pipe: 'bg-blue-100 text-blue-800',
      tobacco: 'bg-green-100 text-green-800',
      accessory: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'growth', label: 'Crescimento', icon: '📈' },
    { id: 'distribution', label: 'Distribuição', icon: '📊' },
    { id: 'activity', label: 'Atividade', icon: '🕒' },
  ];

  return (
    <AdminLayout title="Analytics">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics da Coleção</h1>
          <p className="mt-2 text-sm text-gray-600">
            Análises detalhadas e estatísticas da sua coleção
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.overview.totalItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Imagens</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.overview.totalImages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Comentários</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.overview.totalComments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatFileSize(data.overview.storageUsed)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Crescimento Mensal</h3>
                <p className="text-sm text-gray-500">Comparação entre este mês e o anterior</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🪈</div>
                    <p className="text-sm font-medium text-gray-600">Cachimbos</p>
                    <p className="text-2xl font-semibold text-blue-600">{data.growth.thisMonth.pipes}</p>
                    <p className={`text-sm ${getGrowthColor(getGrowthPercentage(data.growth.thisMonth.pipes, data.growth.lastMonth.pipes))}`}>
                      {getGrowthPercentage(data.growth.thisMonth.pipes, data.growth.lastMonth.pipes) > 0 ? '+' : ''}
                      {getGrowthPercentage(data.growth.thisMonth.pipes, data.growth.lastMonth.pipes)}% vs mês anterior
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl mb-2">🌿</div>
                    <p className="text-sm font-medium text-gray-600">Tabacos</p>
                    <p className="text-2xl font-semibold text-green-600">{data.growth.thisMonth.tobaccos}</p>
                    <p className={`text-sm ${getGrowthColor(getGrowthPercentage(data.growth.thisMonth.tobaccos, data.growth.lastMonth.tobaccos))}`}>
                      {getGrowthPercentage(data.growth.thisMonth.tobaccos, data.growth.lastMonth.tobaccos) > 0 ? '+' : ''}
                      {getGrowthPercentage(data.growth.thisMonth.tobaccos, data.growth.lastMonth.tobaccos)}% vs mês anterior
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl mb-2">🔧</div>
                    <p className="text-sm font-medium text-gray-600">Acessórios</p>
                    <p className="text-2xl font-semibold text-purple-600">{data.growth.thisMonth.accessories}</p>
                    <p className={`text-sm ${getGrowthColor(getGrowthPercentage(data.growth.thisMonth.accessories, data.growth.lastMonth.accessories))}`}>
                      {getGrowthPercentage(data.growth.thisMonth.accessories, data.growth.lastMonth.accessories) > 0 ? '+' : ''}
                      {getGrowthPercentage(data.growth.thisMonth.accessories, data.growth.lastMonth.accessories)}% vs mês anterior
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="text-sm font-medium text-gray-600">Comentários</p>
                    <p className="text-2xl font-semibold text-gray-600">{data.growth.thisMonth.comments}</p>
                    <p className={`text-sm ${getGrowthColor(getGrowthPercentage(data.growth.thisMonth.comments, data.growth.lastMonth.comments))}`}>
                      {getGrowthPercentage(data.growth.thisMonth.comments, data.growth.lastMonth.comments) > 0 ? '+' : ''}
                      {getGrowthPercentage(data.growth.thisMonth.comments, data.growth.lastMonth.comments)}% vs mês anterior
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pipes Distribution */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Distribuição de Cachimbos</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Por Marca</h4>
                      <div className="space-y-2">
                        {data.distribution.pipes.byBrand.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.brand}</span>
                            <span className="text-sm font-medium text-blue-600">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tobaccos Distribution */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Distribuição de Tabacos</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Por Tipo</h4>
                      <div className="space-y-2">
                        {data.distribution.tobaccos.byType.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.type}</span>
                            <span className="text-sm font-medium text-green-600">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Items */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Itens Recentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data.recent.recentItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <span className="text-lg">{getItemTypeIcon(item.type)}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getItemTypeColor(item.type)}`}>
                          {item.type === 'pipe' ? 'Cachimbo' : item.type === 'tobacco' ? 'Tabaco' : 'Acessório'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Comments */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Comentários Recentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data.recent.recentComments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                        <p className="text-sm text-gray-900 line-clamp-2">{comment.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Em: {comment.itemName}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                comment.isApproved
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {comment.isApproved ? 'Aprovado' : 'Pendente'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Overview data
    const [
      totalPipes,
      totalTobaccos,
      totalAccessories,
      totalImages,
      totalComments,
      storageUsed,
    ] = await Promise.all([
      prisma.pipe.count({ where: { isActive: true } }),
      prisma.tobacco.count({ where: { isActive: true } }),
      prisma.accessory.count({ where: { isActive: true } }),
      prisma.image.count(),
      prisma.comment.count(),
      prisma.image.aggregate({ _sum: { fileSize: true } }),
    ]);

    // Growth data
    const [
      pipesThisMonth,
      tobaccosThisMonth,
      accessoriesThisMonth,
      commentsThisMonth,
      pipesLastMonth,
      tobaccosLastMonth,
      accessoriesLastMonth,
      commentsLastMonth,
    ] = await Promise.all([
      prisma.pipe.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.tobacco.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.accessory.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.comment.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.pipe.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          } 
        } 
      }),
      prisma.tobacco.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          } 
        } 
      }),
      prisma.accessory.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          } 
        } 
      }),
      prisma.comment.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          } 
        } 
      }),
    ]);

    // Distribution data
    const [
      pipesByBrand,
      pipesByMaterial,
      pipesByShape,
      tobaccosByBrand,
      tobaccosByType,
      tobaccosByStrength,
      accessoriesByCategory,
      accessoriesByBrand,
    ] = await Promise.all([
      prisma.pipe.groupBy({
        by: ['brand'],
        _count: { brand: true },
        orderBy: { _count: { brand: 'desc' } },
        take: 10,
      }),
      prisma.pipe.groupBy({
        by: ['material'],
        _count: { material: true },
        orderBy: { _count: { material: 'desc' } },
        take: 10,
      }),
      prisma.pipe.groupBy({
        by: ['shape'],
        _count: { shape: true },
        orderBy: { _count: { shape: 'desc' } },
        take: 10,
      }),
      prisma.tobacco.groupBy({
        by: ['brand'],
        _count: { brand: true },
        orderBy: { _count: { brand: 'desc' } },
        take: 10,
      }),
      prisma.tobacco.groupBy({
        by: ['blendType'],
        _count: { blendType: true },
        orderBy: { _count: { blendType: 'desc' } },
        take: 10,
      }),
      prisma.tobacco.groupBy({
        by: ['strength'],
        _count: { strength: true },
        orderBy: { _count: { strength: 'desc' } },
        take: 10,
      }),
      prisma.accessory.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
        take: 10,
      }),
      prisma.accessory.groupBy({
        by: ['brand'],
        _count: { brand: true },
        where: { brand: { not: null } },
        orderBy: { _count: { brand: 'desc' } },
        take: 10,
      }),
    ]);

    // Recent activity
    const [recentPipes, recentTobaccos, recentAccessories, recentComments] = await Promise.all([
      prisma.pipe.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.tobacco.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.accessory.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.comment.findMany({
        select: {
          id: true,
          content: true,
          createdAt: true,
          isApproved: true,
          itemType: true,
          itemId: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Get item names for comments
    const commentsWithItemNames = await Promise.all(
      recentComments.map(async (comment) => {
        let itemName = 'Item não encontrado';
        try {
          if (comment.itemType === 'pipe') {
            const pipe = await prisma.pipe.findUnique({
              where: { id: comment.itemId },
              select: { name: true },
            });
            itemName = pipe?.name || 'Cachimbo não encontrado';
          } else if (comment.itemType === 'tobacco') {
            const tobacco = await prisma.tobacco.findUnique({
              where: { id: comment.itemId },
              select: { name: true },
            });
            itemName = tobacco?.name || 'Tabaco não encontrado';
          } else if (comment.itemType === 'accessory') {
            const accessory = await prisma.accessory.findUnique({
              where: { id: comment.itemId },
              select: { name: true },
            });
            itemName = accessory?.name || 'Acessório não encontrado';
          }
        } catch (error) {
          console.error('Error fetching item name:', error);
        }
        
        return {
          ...comment,
          itemName,
        };
      })
    );

    // Combine recent items
    const recentItems = [
      ...recentPipes.map(item => ({ ...item, type: 'pipe' as const })),
      ...recentTobaccos.map(item => ({ ...item, type: 'tobacco' as const })),
      ...recentAccessories.map(item => ({ ...item, type: 'accessory' as const })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }));

    const data: AnalyticsData = {
      overview: {
        totalItems: totalPipes + totalTobaccos + totalAccessories,
        totalImages,
        totalComments,
        storageUsed: storageUsed._sum.fileSize || 0,
      },
      growth: {
        thisMonth: {
          pipes: pipesThisMonth,
          tobaccos: tobaccosThisMonth,
          accessories: accessoriesThisMonth,
          comments: commentsThisMonth,
        },
        lastMonth: {
          pipes: pipesLastMonth,
          tobaccos: tobaccosLastMonth,
          accessories: accessoriesLastMonth,
          comments: commentsLastMonth,
        },
      },
      distribution: {
        pipes: {
          byBrand: pipesByBrand.map(item => ({ brand: item.brand, count: item._count.brand })),
          byMaterial: pipesByMaterial.map(item => ({ material: item.material, count: item._count.material })),
          byShape: pipesByShape.map(item => ({ shape: item.shape, count: item._count.shape })),
        },
        tobaccos: {
          byBrand: tobaccosByBrand.map(item => ({ brand: item.brand, count: item._count.brand })),
          byType: tobaccosByType.map(item => ({ type: item.blendType, count: item._count.blendType })),
          byStrength: tobaccosByStrength.map(item => ({ strength: item.strength.toString(), count: item._count.strength })),
        },
        accessories: {
          byCategory: accessoriesByCategory.map(item => ({ category: item.category, count: item._count.category })),
          byBrand: accessoriesByBrand.map(item => ({ brand: item.brand!, count: item._count.brand })),
        },
      },
      recent: {
        recentItems,
        recentComments: commentsWithItemNames.map(comment => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
        })),
      },
    };

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // Return empty data structure on error
    const emptyData: AnalyticsData = {
      overview: {
        totalItems: 0,
        totalImages: 0,
        totalComments: 0,
        storageUsed: 0,
      },
      growth: {
        thisMonth: { pipes: 0, tobaccos: 0, accessories: 0, comments: 0 },
        lastMonth: { pipes: 0, tobaccos: 0, accessories: 0, comments: 0 },
      },
      distribution: {
        pipes: { byBrand: [], byMaterial: [], byShape: [] },
        tobaccos: { byBrand: [], byType: [], byStrength: [] },
        accessories: { byCategory: [], byBrand: [] },
      },
      recent: {
        recentItems: [],
        recentComments: [],
      },
    };

    return {
      props: {
        data: emptyData,
      },
    };
  }
};