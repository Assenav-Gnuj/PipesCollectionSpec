import Layout from '../src/components/Layout';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <Layout
      title="Sobre - Pipes & Tobacco Collection"
      description="Conheça nossa paixão por cachimbos e tabacos. Uma coleção cuidadosamente curada e documentada para entusiastas e colecionadores."
      keywords="sobre, coleção, cachimbos, tabacos, história, paixão, hobby"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sobre Nossa Coleção
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Uma paixão transformada em coleção. Explore conosco o fascinante mundo dos cachimbos, 
                tabacos e acessórios, onde cada peça conta uma história única.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Nossa História */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    O que começou como um simples hobby se transformou em uma verdadeira paixão pela arte 
                    e tradição dos cachimbos. Há mais de uma década, iniciamos esta jornada coletando 
                    peças especiais e descobrindo a rica cultura que envolve o mundo do tabaco.
                  </p>
                  <p>
                    Cada cachimbo em nossa coleção foi cuidadosamente selecionado, não apenas pela sua 
                    qualidade artesanal, mas também pela história que carrega. Desde peças vintage de 
                    renomados fabricantes até criações contemporâneas de artesãos talentosos.
                  </p>
                  <p>
                    Esta plataforma digital nasceu do desejo de compartilhar nossa paixão e conhecimento 
                    com outros entusiastas, criando um espaço onde a tradição e a modernidade se encontram.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                  <div className="text-center">
                    <div className="bg-amber-100 rounded-full p-6 mb-4 inline-block">
                      <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">10+ Anos</h3>
                    <p className="text-gray-600">de dedicação à arte dos cachimbos</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Nossa Missão */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nossa Missão</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 mb-4 inline-block">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Preservar</h3>
                  <p className="text-gray-600">
                    Documentar e preservar a rica tradição dos cachimbos e tabacos para as futuras gerações.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 mb-4 inline-block">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Educar</h3>
                  <p className="text-gray-600">
                    Compartilhar conhecimento sobre técnicas, história e cultura dos cachimbos.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 mb-4 inline-block">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.98 1.98 0 0 0 18.06 7H16c-.8 0-1.54.37-2.01.99l-2.54 7.64H14v6h6z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Conectar</h3>
                  <p className="text-gray-600">
                    Unir entusiastas e colecionadores em uma comunidade apaixonada pela arte do tabaco.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Estatísticas da Coleção */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossa Coleção em Números</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-lg font-medium text-blue-800 mb-1">Cachimbos</div>
                <div className="text-sm text-blue-600">De diversas marcas e estilos</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
                <div className="text-lg font-medium text-green-800 mb-1">Tabacos</div>
                <div className="text-sm text-green-600">Blends únicos e especiais</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-lg font-medium text-purple-800 mb-1">Acessórios</div>
                <div className="text-sm text-purple-600">Para o perfeito ritual</div>
              </div>
            </div>
          </section>

          {/* Filosofia */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nossa Filosofia</h2>
              <div className="max-w-4xl mx-auto">
                <blockquote className="text-xl text-gray-700 italic text-center mb-6 leading-relaxed">
                  "Um cachimbo não é apenas um objeto, é um companheiro de momentos reflexivos, 
                  um convite à contemplação e uma ponte entre tradições milenares e o presente."
                </blockquote>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualidade sobre Quantidade</h3>
                    <p className="text-gray-700">
                      Preferimos uma coleção cuidadosamente curada, onde cada peça tem seu valor 
                      e história, do que simplesmente acumular objetos.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tradição e Inovação</h3>
                    <p className="text-gray-700">
                      Respeitamos as técnicas tradicionais enquanto abraçamos inovações que 
                      enriquecem a experiência dos entusiastas modernos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Marcas Destacadas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Marcas em Destaque</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                'Dunhill', 'Peterson', 'Savinelli', 'Stanwell', 'Brigham', 'Chacom',
                'Castello', 'Mastro de Paja', 'Butz-Choquin', 'Vauen', 'Rattray\'s', 'Cornell & Diehl'
              ].map((brand) => (
                <div key={brand} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="text-sm font-medium text-gray-900">{brand}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contato */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Entre em Contato</h2>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-700 mb-6">
                Tem alguma dúvida sobre nossa coleção? Quer compartilhar sua própria experiência 
                com cachimbos? Entre em contato conosco!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:contato@pipescollection.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Enviar Email
                </a>
                <button className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Seguir no Instagram
                </button>
              </div>
            </div>
          </section>
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