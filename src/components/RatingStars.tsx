import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  totalRatings,
  size = 'md',
  interactive = false,
  onRate,
  className = ''
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxStars = 5;
  const displayRating = interactive && hoveredRating > 0 ? hoveredRating : rating;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const handleStarClick = async (starRating: number) => {
    if (!interactive || !onRate || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRate(starRating);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!interactive || isSubmitting) return;
    setHoveredRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoveredRating(0);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stars */}
      <div 
        className="flex items-center space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxStars)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.floor(displayRating);
          const isHalfFilled = starNumber === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={index}
              type="button"
              className={`relative ${sizeClasses[size]} ${
                interactive 
                  ? 'cursor-pointer hover:scale-110 transition-transform' 
                  : 'cursor-default'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleStarClick(starNumber)}
              onMouseEnter={() => handleStarHover(starNumber)}
              disabled={!interactive || isSubmitting}
              aria-label={`${interactive ? 'Rate' : 'Rating'} ${starNumber} star${starNumber !== 1 ? 's' : ''}`}
            >
              {/* Background star (empty) */}
              <svg
                className={`${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {/* Filled star */}
              {(isFilled || isHalfFilled) && (
                <svg
                  className={`absolute inset-0 ${sizeClasses[size]} text-amber-400`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{
                    clipPath: isHalfFilled ? 'inset(0 50% 0 0)' : 'none'
                  }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}

              {/* Hover effect for interactive stars */}
              {interactive && hoveredRating >= starNumber && (
                <svg
                  className={`absolute inset-0 ${sizeClasses[size]} text-amber-500`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Rating Text */}
      <div className={`flex items-center space-x-1 ${textSizeClasses[size]}`}>
        <span className="font-medium text-gray-900">
          {rating > 0 ? rating.toFixed(1) : '0.0'}
        </span>
        
        {totalRatings !== undefined && (
          <span className="text-gray-500">
            ({totalRatings} {totalRatings === 1 ? 'avaliação' : 'avaliações'})
          </span>
        )}
      </div>

      {/* Loading indicator */}
      {isSubmitting && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
        </div>
      )}
    </div>
  );
}