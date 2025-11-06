import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <header className="bg-surface shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
         <h1 className="text-xl font-semibold text-text-primary">{currentView}</h1>
         <div className="flex items-center">
             <img className="h-9 w-9 rounded-full" src="https://i.pravatar.cc/150?u=currentuser" alt="User avatar" />
         </div>
      </div>
    </header>
  );
};

export default Header;
