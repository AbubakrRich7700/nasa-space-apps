import React from 'react';
import { Telescope, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  return (
    <header className="p-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setCurrentPage('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Telescope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Exoplanet Classifier</h1>
            <p className="text-sm text-gray-300">Smart AI Tool</p>
          </div>
        </div>

        {currentPage !== 'home' && (
          <Button
            variant="outline"
            onClick={() => setCurrentPage('home')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        )}
      </div>
    </header>
  );
}