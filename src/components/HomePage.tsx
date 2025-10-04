import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Rocket, Target, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1729722615809-45b3f2ad1747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHRlbGVzY29wZSUyMHN0YXJzJTIwZ2FsYXh5fGVufDF8fHx8MTc1ODk1ODY4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Space telescope and stars"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover New Worlds
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            This website helps discover new exoplanets using AI
          </p>
          <p className="text-lg mb-12 text-gray-400">
            Analyze NASA data from Kepler, K2, and TESS missions to detect planets beyond our Solar System
          </p>
          
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl"
          >
            <Rocket className="w-6 h-6 mr-3" />
            Start Analysis
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gray-900/50 border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-white">Upload Data</h3>
              <p className="text-gray-400">
                Import CSV files or enter parameters manually: orbital period, transit duration, planet radius
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-white">AI Analysis</h3>
              <p className="text-gray-400">
                Our ML model analyzes the data and classifies objects as exoplanets, candidates, or false positives
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-white">Get Results</h3>
              <p className="text-gray-400">
                View results with prediction probability, beautiful charts, and detailed statistics
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl mb-12 text-white">Model Statistics</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">94%</div>
              <p className="text-gray-400">Classification Accuracy</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">5,000+</div>
              <p className="text-gray-400">Objects Analyzed</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">892</div>
              <p className="text-gray-400">Confirmed Exoplanets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}