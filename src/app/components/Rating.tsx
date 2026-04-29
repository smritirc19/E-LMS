import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Rating({ rating, reviewCount, showCount = true, size = 'sm' }: RatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarHalf key="half" className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
    );
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className={`${textSizeClasses[size]} font-semibold text-gray-900`}>{rating.toFixed(1)}</span>
      {showCount && reviewCount && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
