
import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  comment: string;
  imageSrc: string;
}

const TestimonialCard = ({ name, role, comment, imageSrc }: TestimonialCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full flex flex-col">
      <div className="flex-grow">
        <div className="mb-4 text-yellow-400">
          {/* Star Rating */}
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-6 italic">"{comment}"</p>
      </div>
      <div className="flex items-center">
        <img
          src={imageSrc}
          alt={`Foto de ${name}`}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
