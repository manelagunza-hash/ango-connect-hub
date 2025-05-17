
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

const ServiceCard = ({ title, description, icon: Icon, link }: ServiceCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-accent/50 hover:translate-y-[-5px]">
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-secondary rounded-full mb-4 transition-colors hover:bg-accent/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={link}
          className="text-accent hover:text-accent-hover font-medium transition-colors inline-flex items-center group"
        >
          Ver Profissionais
          <svg
            className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
