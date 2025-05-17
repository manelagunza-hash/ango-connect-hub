
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  step: number;
}

const StepCard = ({ title, description, icon: Icon, step }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="relative">
        <div className="bg-secondary rounded-full p-5 mb-4 relative">
          <Icon size={32} className="text-primary" />
        </div>
        <div className="absolute -top-3 -right-3 bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default StepCard;
