import React from 'react'
import { FaStar } from 'react-icons/fa';
type RatingShowProps = {
    value: number;
    className:string;
}
const RatingShow: React.FC<RatingShowProps> = ({ value, className }) => {

    return (
        <div className="flex items-center justify-center space-x-1 w-full">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={`${className} ${value >= index + 1 ? 'text-blue-600' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    )
}

export default RatingShow