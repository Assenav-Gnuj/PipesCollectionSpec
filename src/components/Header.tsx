import Link from 'next/link';
import { useState } from 'react';
import SearchBox from './SearchBox';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C&T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Cachimbos & Tabacos</h1>
                <p className="text-sm text-gray-600">Coleção Premium</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/cachimbos" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Cachimbos
            </Link>
            <Link href="/tabacos" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Tabacos
            </Link>
            <Link href="/acessorios" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Acessórios
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Search Box */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBox />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-amber-600 focus:outline-none focus:text-amber-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link 
                href="/cachimbos" 
                className="block text-gray-700 hover:text-amber-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cachimbos
              </Link>
              <Link 
                href="/tabacos" 
                className="block text-gray-700 hover:text-amber-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tabacos
              </Link>
              <Link 
                href="/acessorios" 
                className="block text-gray-700 hover:text-amber-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acessórios
              </Link>
              <Link 
                href="/sobre" 
                className="block text-gray-700 hover:text-amber-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <div className="pt-4">
                <SearchBox />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}