import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C&T</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Cachimbos & Tabacos</h3>
                <p className="text-gray-400 text-sm">Coleção Premium</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Uma coleção cuidadosamente curada de cachimbos, tabacos e acessórios premium. 
              Compartilhando a paixão pela arte do fumo de cachimbo.
            </p>
            <p className="text-sm text-gray-500">
              🇧🇷 Brasília, DF - Brasil
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cachimbos" className="text-gray-400 hover:text-white transition-colors">
                  Cachimbos
                </Link>
              </li>
              <li>
                <Link href="/tabacos" className="text-gray-400 hover:text-white transition-colors">
                  Tabacos
                </Link>
              </li>
              <li>
                <Link href="/acessorios" className="text-gray-400 hover:text-white transition-colors">
                  Acessórios
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informações</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contato@cachimbosetabacos.com.br" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>&copy; {currentYear} Cachimbos & Tabacos. Todos os direitos reservados.</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Construído com ❤️ para apreciadores de cachimbo
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              ⚠️ Aviso: Este site é apenas para maiores de 18 anos. O fumo pode causar dependência e sérios riscos à saúde.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}