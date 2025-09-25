import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../src/components/Layout';
import ItemCard, { ItemGrid } from '../src/components/ItemCard';
import { prisma } from '@/lib/prisma';

interface HomePageProps {
  featuredPipes: any[];
  featuredTobaccos: any[];
  featuredAccessories: any[];
  stats: {
    totalPipes: number;
    totalTobaccos: number;
    totalAccessories: number;
    totalUsers: number;
  };
}

export default function HomePage({ 
  featuredPipes, 
  featuredTobaccos, 
  featuredAccessories,
  stats 
}: HomePageProps) {
  return (
    <Layout
      title="Pipes & Tobacco Collection - Sua Coleção Digital"
      description="Descubra e gerencie sua coleção de cachimbos, tabacos e acessórios. Avalie, comente e compartilhe sua paixão pelo mundo do cachimbo."
      keywords="cachimbos, tabacos, coleção, pipe tobacco, smoking"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Sua Coleção de
                  <span className="text-amber-600 block">Cachimbos & Tabacos</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Descubra, organize e compartilhe sua paixão pelo mundo dos cachimbos. 
                  Uma plataforma completa para colecionadores e entusiastas.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cachimbos"
                  className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explorar Cachimbos
                </Link>
                <Link
                  href="/tabacos"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Ver Tabacos
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600">
                    {stats.totalPipes}
                  </div>
                  <div className="text-sm text-gray-600">Cachimbos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600">
                    {stats.totalTobaccos}
                  </div>
                  <div className="text-sm text-gray-600">Tabacos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600">
                    {stats.totalAccessories}
                  </div>
                  <div className="text-sm text-gray-600">Acessórios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600">
                    {stats.totalUsers}
                  </div>
                  <div className="text-sm text-gray-600">Usuários</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-pipes-collection.jpg"
                  alt="Coleção de cachimbos artesanais"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Avaliações</div>
                    <div className="text-sm text-gray-600">Compartilhe experiências</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pipes Section */}
      {featuredPipes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Cachimbos em Destaque</h2>
                <p className="text-gray-600 mt-2">Peças selecionadas da nossa coleção</p>
              </div>
              <Link
                href="/cachimbos"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
              >
                Ver todos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <ItemGrid
              items={featuredPipes}
              itemType="pipe"
              size="md"
              showPrice={true}
              showRating={true}
              showDescription={true}
            />
          </div>
        </section>
      )}

      {/* Featured Tobaccos Section */}
      {featuredTobaccos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Tabacos Especiais</h2>
                <p className="text-gray-600 mt-2">Misturas e blends únicos</p>
              </div>
              <Link
                href="/tabacos"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
              >
                Ver todos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <ItemGrid
              items={featuredTobaccos}
              itemType="tobacco"
              size="md"
              showPrice={true}
              showRating={true}
              showDescription={true}
            />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore por Categoria</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra nossa coleção organizada por tipo e categoria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pipes Category */}
            <Link href="/cachimbos" className="group">
              <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cachimbos</h3>
                <p className="text-gray-600 mb-4">Artesanais, clássicos e modernos</p>
                <span className="inline-flex items-center text-amber-600 font-medium group-hover:text-amber-700">
                  Explorar coleção
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Tobaccos Category */}
            <Link href="/tabacos" className="group">
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tabacos</h3>
                <p className="text-gray-600 mb-4">Aromáticos, English e Virginia</p>
                <span className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
                  Ver misturas
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Accessories Category */}
            <Link href="/acessorios" className="group">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Acessórios</h3>
                <p className="text-gray-600 mb-4">Ferramentas e itens essenciais</p>
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  Ver acessórios
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Mantenha-se Atualizado
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Receba notificações sobre novos itens, avaliações e novidades do mundo dos cachimbos
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button className="px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors">
                  Inscrever
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Respeitamos sua privacidade. Cancele a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch featured items (top-rated or recent)
    const [featuredPipes, featuredTobaccos, featuredAccessories, stats] = await Promise.all([
      // Featured Pipes
      prisma.pipe.findMany({
        take: 4,
        orderBy: [
          { createdAt: 'desc' },
        ],
      }),

      // Featured Tobaccos
      prisma.tobacco.findMany({
        take: 4,
        orderBy: [
          { createdAt: 'desc' },
        ],
      }),

      // Featured Accessories
      prisma.accessory.findMany({
        take: 4,
        orderBy: [
          { createdAt: 'desc' },
        ],
      }),

      // Stats
      Promise.all([
        prisma.pipe.count(),
        prisma.tobacco.count(),
        prisma.accessory.count(),
        prisma.user.count(),
      ]).then(([pipes, tobaccos, accessories, users]) => ({
        totalPipes: pipes,
        totalTobaccos: tobaccos,
        totalAccessories: accessories,
        totalUsers: users,
      })),
    ]);

    // Get ratings and images for featured items
    const allItemIds = [
      ...featuredPipes.map((p: any) => ({ id: p.id, type: 'pipe' as const })),
      ...featuredTobaccos.map((t: any) => ({ id: t.id, type: 'tobacco' as const })),
      ...featuredAccessories.map((a: any) => ({ id: a.id, type: 'accessory' as const })),
    ];

    const [ratings, images] = await Promise.all([
      prisma.rating.findMany({
        where: {
          OR: allItemIds.map(item => ({
            itemId: item.id,
            itemType: item.type,
          })),
        },
        select: {
          itemId: true,
          itemType: true,
          rating: true,
        },
      }),
      prisma.image.findMany({
        where: {
          OR: allItemIds.map(item => ({
            itemId: item.id,
            itemType: item.type,
          })),
          isFeatured: true,
        },
        select: {
          itemId: true,
          itemType: true,
          filename: true,
        },
      }),
    ]);

    // Transform data to match ItemCard interface
    const transformItem = (item: any, itemType: string) => {
      const itemRatings = ratings.filter((r: any) => r.itemId === item.id);
      const itemImage = images.find((img: any) => img.itemId === item.id);
      
      return {
        id: item.id,
        name: item.name,
        manufacturer: item.brand,
        images: itemImage ? [`/api/images/${itemImage.filename}`] : [],
        averageRating: itemRatings.length > 0 
          ? itemRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / itemRatings.length 
          : 0,
        totalRatings: itemRatings.length,
        inStock: item.isActive,
        type: itemType,
        category: itemType === 'pipe' ? item.shape : 
                 itemType === 'tobacco' ? item.blendType : 
                 item.category,
      };
    };    return {
      props: {
        featuredPipes: featuredPipes.map((item: any) => transformItem(item, 'pipe')),
        featuredTobaccos: featuredTobaccos.map((item: any) => transformItem(item, 'tobacco')),
        featuredAccessories: featuredAccessories.map((item: any) => transformItem(item, 'accessory')),
        stats,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    return {
      props: {
        featuredPipes: [],
        featuredTobaccos: [],
        featuredAccessories: [],
        stats: {
          totalPipes: 0,
          totalTobaccos: 0,
          totalAccessories: 0,
          totalUsers: 0,
        },
      },
      revalidate: 60,
    };
  }
};