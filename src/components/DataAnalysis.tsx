import React, { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DataUpload } from './DataUpload';
import { ManualInput } from './ManualInput';
import { AnalysisResults } from './AnalysisResults';
import { Upload, Edit, ArrowRight } from 'lucide-react';

interface DataAnalysisProps {
  onBack: () => void;
}

export interface PlanetData {
  orbitalPeriod: number;
  transitDuration: number;
  planetRadius: number;
  stellarRadius: number;
  equilibriumTemp: number;
  insolationFlux: number;
}

export function DataAnalysis({ onBack }: DataAnalysisProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [data, setData] = useState<PlanetData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleDataUpload = (uploadedData: PlanetData[]) => {
    setData(uploadedData);
  };

  const handleManualInput = (inputData: PlanetData) => {
    setData([inputData]);
  };

  const runAnalysis = async () => {
    if (data.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate ML analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResults = data.map((planetData, index) => {
      // Simple classification logic based on parameters
      const score = calculateClassificationScore(planetData);
      const classification = getClassification(score);
      const confidence = Math.min(Math.max(score + Math.random() * 0.2 - 0.1, 0.5), 0.99);

      return {
        id: index + 1,
        data: planetData,
        classification,
        confidence: Math.round(confidence * 100),
        score
      };
    });

    setResults(analysisResults);
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const calculateClassificationScore = (data: PlanetData): number => {
    // Simplified scoring algorithm
    let score = 0.5;
    
    // Orbital period influence
    if (data.orbitalPeriod > 0.5 && data.orbitalPeriod < 400) {
      score += 0.2;
    }
    
    // Transit duration influence
    if (data.transitDuration > 0.1 && data.transitDuration < 15) {
      score += 0.15;
    }
    
    // Planet radius influence
    if (data.planetRadius > 0.5 && data.planetRadius < 10) {
      score += 0.15;
    }
    
    // Temperature influence
    if (data.equilibriumTemp > 200 && data.equilibriumTemp < 2000) {
      score += 0.1;
    }

    return Math.min(score, 0.95);
  };

  const getClassification = (score: number): string => {
    if (score > 0.8) return 'Confirmed Exoplanet';
    if (score > 0.6) return 'Planet Candidate';
    return 'False Positive';
  };

  if (showResults) {
    return (
      <AnalysisResults 
        results={results} 
        onBack={() => setShowResults(false)}
        onNewAnalysis={() => {
          setShowResults(false);
          setData([]);
          setResults([]);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-4">Exoplanet Data Analysis</h1>
        <p className="text-gray-400">
          Upload data or enter parameters manually for AI-powered analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Manual Input</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <DataUpload onDataUpload={handleDataUpload} />
        </TabsContent>

        <TabsContent value="manual">
          <ManualInput onSubmit={handleManualInput} />
        </TabsContent>
      </Tabs>

      {data.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ready for Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Loaded {data.length} object(s) for analysis
            </p>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}