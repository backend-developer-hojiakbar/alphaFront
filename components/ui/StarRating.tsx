
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  isStatic?: boolean;
  starSize?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  isStatic = false,
  starSize = 'h-6 w-6'
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index: number) => {
    if (!isStatic && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isStatic) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isStatic) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => {
        const fillValue = hoverRating >= index ? 'fill-yellow-400 text-yellow-400' : rating >= index ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500';
        
        return (
          <Star
            key={index}
            className={`${starSize} ${fillValue} transition-colors duration-150 ${!isStatic ? 'cursor-pointer' : ''}`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
