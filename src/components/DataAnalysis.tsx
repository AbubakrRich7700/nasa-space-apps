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
    
    try {
      // РЕАЛЬНЫЙ ML АНАЛИЗ через API
      const analysisResults = await Promise.all(
        data.map(async (planetData, index) => {
          try {
            console.log('Sending to ML API:', planetData);
            
            const response = await fetch('https://exoplanet-ml-api.onrender.com/api/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orbital_period: planetData.orbitalPeriod,
                transit_duration: planetData.transitDuration,
                planet_radius: planetData.planetRadius,
                stellar_radius: planetData.stellarRadius,
                equilibrium_temp: planetData.equilibriumTemp,
                insolation_flux: planetData.insolationFlux
              })
            });

            if (!response.ok) {
              throw new Error('ML API error: ' + response.status);
            }

            const mlResult = await response.json();
            console.log('ML API response:', mlResult);
            
            // Конвертируем результат ML в наш формат
            const isExoplanet = mlResult.prediction === 'EXOPLANET';
            const confidence = Math.round(mlResult.confidence * 100);
            
            return {
              id: index + 1,
              data: planetData,
              classification: isExoplanet ? 'Confirmed Exoplanet' : 'False Positive',
              confidence: confidence,
              mlResult: mlResult // Сохраняем полный результат ML
            };
          } catch (error) {
            console.error('ML analysis failed for object:', index, error);
            return {
              id: index + 1,
              data: planetData,
              classification: 'Analysis Error',
              confidence: 0,
              error: 'ML analysis failed: ' + error.message
            };
          }
        })
      );

      console.log('All analysis results:', analysisResults);
      setResults(analysisResults);
      setShowResults(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
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
