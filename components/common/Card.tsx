

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // Fix: Add onClick prop to support click events on the card.
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-surface rounded-lg shadow-sm p-4 sm:p-6 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
