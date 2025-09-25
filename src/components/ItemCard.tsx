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
      container: '',
      image: 'h-32',
      title: 'text-sm',
      subtitle: 'text-xs',
      description: 'text-xs',
      price: 'text-sm'
    },
    md: {
      container: '',
      image: 'h-40',
      title: 'text-base',
      subtitle: 'text-sm',
      description: 'text-sm',
      price: 'text-base'
    },
    lg: {
      container: '',
      image: 'h-48',
      title: 'text-lg',
      subtitle: 'text-base',
      description: 'text-base',
      price: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];
  const primaryImage = item.images?.[0] || '/images/placeholder-item.jpg';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getItemInfo = () => {
    switch (itemType) {
      case 'pipe':
        return {
          title: item.name,
          subtitle: item.brand && item.model ? item.brand + ' - ' + item.model : item.brand || item.model || ''
        };
      case 'tobacco':
        return {
          title: item.name,
          subtitle: item.brand && item.type ? item.brand + ' - ' + item.type : item.brand || item.type || ''
        };
      case 'accessory':
        return {
          title: item.name,
          subtitle: item.manufacturer && item.category ? item.manufacturer + ' - ' + item.category : item.manufacturer || item.category || ''
        };
      default:
        return {
          title: item.name,
          subtitle: ''
        };
    }
  };

  const { title, subtitle } = getItemInfo();

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const getLinkHref = () => {
    switch (itemType) {
      case 'pipe':
        return '/cachimbos/' + item.id;
      case 'tobacco':
        return '/tabacos/' + item.id;
      case 'accessory':
        return '/acessorios/' + item.id;
      default:
        return '/' + itemType + 's/' + item.id;
    }
  };

  const linkHref = getLinkHref();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <Link href={linkHref} className="block">
        <div className={'relative ' + currentSize.image + ' bg-gray-200 overflow-hidden'}>
          <Image
            src={primaryImage}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {item.inStock !== undefined && (
            <div className="absolute top-2 right-2">
              <span className={'px-2 py-1 text-xs font-medium rounded-full ' + (
                item.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              )}>
                {item.inStock ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className={currentSize.title + ' font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors'}>
              {title}
            </h3>
            {subtitle && (
              <p className={currentSize.subtitle + ' text-gray-600 mt-1 line-clamp-1'}>
                {subtitle}
              </p>
            )}
          </div>

          {showRating && item.averageRating !== undefined && (
            <div className="mb-2">
              <RatingStars
                rating={item.averageRating}
                totalRatings={item.totalRatings}
                size={size === 'lg' ? 'md' : 'sm'}
              />
            </div>
          )}

          {showDescription && item.description && (
            <p className={currentSize.description + ' text-gray-700 mb-3 line-clamp-2'}>
              {size === 'sm' 
                ? truncateDescription(item.description, 60)
                : size === 'md'
                ? truncateDescription(item.description, 100)
                : truncateDescription(item.description, 150)
              }
            </p>
          )}

          {showPrice && item.price !== undefined && (
            <div className="flex items-center justify-between">
              <span className={currentSize.price + ' font-bold text-amber-600'}>
                {formatPrice(item.price)}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

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
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
            <div className="bg-gray-300 h-40"></div>
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
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
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
