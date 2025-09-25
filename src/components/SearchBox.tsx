import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SearchResult {
  type: 'pipe' | 'tobacco' | 'accessory';
  id: string;
  name: string;
  brand: string;
  url: string;
  [key: string]: any;
}

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ placeholder = "Buscar cachimbos, tabacos...", className = "" }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      router.push(`/busca?q=${encodeURIComponent(query)}`);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pipe': return 'Cachimbo';
      case 'tobacco': return 'Tabaco';
      case 'accessory': return 'Acessório';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pipe': return 'bg-blue-100 text-blue-800';
      case 'tobacco': return 'bg-green-100 text-green-800';
      case 'accessory': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={handleResultClick}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(result.type)}`}>
                        {getTypeLabel(result.type)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {result.brand}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          
          {query.trim() && (
            <div className="border-t border-gray-200 px-4 py-3">
              <Link
                href={`/busca?q=${encodeURIComponent(query)}`}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                onClick={handleResultClick}
              >
                Ver todos os resultados para "{query}"
              </Link>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && !loading && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500">Nenhum resultado encontrado para "{query}"</p>
          </div>
        </div>
      )}
    </div>
  );
}