import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

type RatingProps ={
    value:number;
    onChange: (value:number)=>void;
    
}
const Rating:React.FC<RatingProps> = ({value, onChange}) => {
  const [hover, setHover] = useState(value);


  return (
    <div className="flex items-center justify-center space-x-1 w-full">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <FaStar
              className={`w-6 h-6 transition-colors duration-200 ${
                (hover || value) >= starValue ? 'text-blue-600' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
