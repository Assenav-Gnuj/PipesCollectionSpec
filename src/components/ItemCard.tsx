import Link from 'next/link';
import Image from 'next/image';
import RatingStars from './RatingStars';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    type?: string;
    manufacturer?: string;
    price?: number;
    images?: string[];
    description?: string;
    averageRating?: number;
    totalRatings?: number;
    inStock?: boolean;
    category?: string;
  };
  itemType: 'pipe' | 'tobacco' | 'accessory';
  size?: 'sm' | 'md' | 'lg';
  showPrice?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function ItemCard({
  item,
  itemType,
  size = 'md',
  showPrice = true,
  showRating = true,
  showDescription = true,
  className = ''
}: ItemCardProps) {
  
  const sizeClasses = {
    sm: {
      container: 'w-48',
      image: 'h-32',
      title: 'text-sm',
      subtitle: 'text-xs',
      description: 'text-xs',
      price: 'text-sm'
    },
    md: {
      container: 'w-64',
      image: 'h-40',
      title: 'text-base',
      subtitle: 'text-sm',
      description: 'text-sm',
      price: 'text-base'
    },
    lg: {
      container: 'w-80',
      image: 'h-48',
      title: 'text-lg',
      subtitle: 'text-base',
      description: 'text-base',
      price: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  // Get the primary image or fallback
  const primaryImage = item.images?.[0] || '/images/placeholder-item.jpg';

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Get item title and subtitle based on type
  const getItemInfo = () => {
    switch (itemType) {
      case 'pipe':
        return {
          title: item.name,
          subtitle: item.brand && item.model ? `${item.brand} - ${item.model}` : item.brand || item.model || ''
        };
      case 'tobacco':
        return {
          title: item.name,
          subtitle: item.brand && item.type ? `${item.brand} - ${item.type}` : item.brand || item.type || ''
        };
      case 'accessory':
        return {
          title: item.name,
          subtitle: item.manufacturer && item.category ? `${item.manufacturer} - ${item.category}` : item.manufacturer || item.category || ''
        };
      default:
        return {
          title: item.name,
          subtitle: ''
        };
    }
  };

  const { title, subtitle } = getItemInfo();

  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const linkHref = `/${itemType}s/${item.id}`;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${currentSize.container} ${className}`}>
      <Link href={linkHref} className="block">
        {/* Image */}
        <div className={`relative ${currentSize.image} bg-gray-200 overflow-hidden`}>
          <Image
            src={primaryImage}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Stock indicator */}
          {item.inStock !== undefined && (
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.inStock ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Subtitle */}
          <div className="mb-2">
            <h3 className={`${currentSize.title} font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`${currentSize.subtitle} text-gray-600 mt-1 line-clamp-1`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Rating */}
          {showRating && item.averageRating !== undefined && (
            <div className="mb-2">
              <RatingStars
                rating={item.averageRating}
                totalRatings={item.totalRatings}
                size={size === 'lg' ? 'md' : 'sm'}
              />
            </div>
          )}

          {/* Description */}
          {showDescription && item.description && (
            <p className={`${currentSize.description} text-gray-700 mb-3 line-clamp-2`}>
              {size === 'sm' 
                ? truncateDescription(item.description, 60)
                : size === 'md'
                ? truncateDescription(item.description, 100)
                : truncateDescription(item.description, 150)
              }
            </p>
          )}

          {/* Price */}
          {showPrice && item.price !== undefined && (
            <div className="flex items-center justify-between">
              <span className={`${currentSize.price} font-bold text-amber-600`}>
                {formatPrice(item.price)}
              </span>
              
              {/* Quick action button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Add to favorites or cart functionality here
                  console.log('Quick action for item:', item.id);
                }}
                className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                aria-label="Adicionar aos favoritos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// Grid component for displaying multiple item cards
interface ItemGridProps {
  items: ItemCardProps['item'][];
  itemType: 'pipe' | 'tobacco' | 'accessory';
  size?: 'sm' | 'md' | 'lg';
  showPrice?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export function ItemGrid({
  items,
  itemType,
  size = 'md',
  showPrice = true,
  showRating = true,
  showDescription = true,
  className = '',
  emptyMessage = 'Nenhum item encontrado.',
  loading = false
}: ItemGridProps) {
  
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        size === 'sm' 
          ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' 
          : size === 'md'
          ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } ${className}`}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
            <div className={`bg-gray-300 ${size === 'sm' ? 'h-32' : size === 'md' ? 'h-40' : 'h-48'}`}></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-3 w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {emptyMessage}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Tente ajustar seus filtros ou fazer uma nova busca.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      size === 'sm' 
        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' 
        : size === 'md'
        ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    } ${className}`}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          itemType={itemType}
          size={size}
          showPrice={showPrice}
          showRating={showRating}
          showDescription={showDescription}
        />
      ))}
    </div>
  );
}