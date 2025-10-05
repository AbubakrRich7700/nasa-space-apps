import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Edit, Send, Brain } from 'lucide-react';
import { PlanetData } from './DataAnalysis';

interface ManualInputProps {
  onSubmit: (data: PlanetData) => void;
}

// ML API конфигурация
const ML_API_URL = "https://exoplanet-ml-api.onrender.com";

export function ManualInput({ onSubmit }: ManualInputProps) {
  const [formData, setFormData] = useState<PlanetData>({
    orbitalPeriod: 0,
    transitDuration: 0,
    planetRadius: 0,
    stellarRadius: 0,
    equilibriumTemp: 0,
    insolationFlux: 0
  });

  const [errors, setErrors] = useState<Partial<PlanetData>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlResult, setMlResult] = useState<any>(null);

  const handleInputChange = (field: keyof PlanetData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear ML result when data changes
    setMlResult(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PlanetData> = {};

    if (formData.orbitalPeriod <= 0) {
      newErrors.orbitalPeriod = 0;
    }
    if (formData.transitDuration <= 0) {
      newErrors.transitDuration = 0;
    }
    if (formData.planetRadius <= 0) {
      newErrors.planetRadius = 0;
    }
    if (formData.stellarRadius <= 0) {
      newErrors.stellarRadius = 0;
    }
    if (formData.equilibriumTemp <= 0) {
      newErrors.equilibriumTemp = 0;
    }
    if (formData.insolationFlux <= 0) {
      newErrors.insolationFlux = 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // НОВАЯ ФУНКЦИЯ: Анализ с помощью ML
  const analyzeWithML = async (data: PlanetData) => {
    setIsAnalyzing(true);
    setMlResult(null);

    try {
      const response = await fetch(`${ML_API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orbital_period: data.orbitalPeriod,
          transit_duration: data.transitDuration,
          planet_radius: data.planetRadius,
          stellar_radius: data.stellarRadius,
          equilibrium_temp: data.equilibriumTemp,
          insolation_flux: data.insolationFlux
        })
      });

      if (!response.ok) {
        throw new Error('ML API error');
      }

      const result = await response.json();
      setMlResult(result);
      
      // Показываем результат в консоли для отладки
      console.log('ML Analysis Result:', result);
      
    } catch (error) {
      console.error('ML Analysis failed:', error);
      setMlResult({
        prediction: 'ANALYSIS_ERROR',
        confidence: 0,
        error: 'Failed to analyze with AI'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Сначала анализируем с ML
      await analyzeWithML(formData);
      // Затем передаем данные в родительский компонент
      onSubmit(formData);
    }
  };

  const loadExampleData = () => {
    const exampleData = {
      orbitalPeriod: 365.25,
      transitDuration: 6.2,
      planetRadius: 1.0,
      stellarRadius: 1.0,
      equilibriumTemp: 288,
      insolationFlux: 1.0
    };
    setFormData(exampleData);
    setMlResult(null);
  };

  // Функция для отображения результата ML
  const renderMLResult = () => {
    if (!mlResult) return null;

    if (mlResult.error) {
      return (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <h4 className="text-red-400 font-semibold mb-2">❌ AI Analysis Error</h4>
          <p className="text-red-300 text-sm">{mlResult.error}</p>
        </div>
      );
    }

    const confidencePercent = (mlResult.confidence * 100).toFixed(1);
    const isExoplanet = mlResult.prediction === 'EXOPLANET';

    return (
      <div className={`mt-4 p-4 rounded-lg border ${
        isExoplanet 
          ? 'bg-green-900/20 border-green-700' 
          : 'bg-yellow-900/20 border-yellow-700'
      }`}>
        <h4 className="font-semibold mb-2 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          🧠 AI Analysis Result
        </h4>
        <div className="space-y-2 text-sm">
          <p className={isExoplanet ? 'text-green-400' : 'text-yellow-400'}>
            <strong>Prediction:</strong> {mlResult.prediction}
          </p>
          <p className="text-gray-300">
            <strong>Confidence:</strong> {confidencePercent}%
          </p>
          <p className="text-gray-400 text-xs">
            {isExoplanet 
              ? 'This object is likely an exoplanet!' 
              : 'This object may not be an exoplanet'
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Edit className="w-5 h-5 mr-2" />
          Ручной ввод параметров
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Все поля остаются без изменений */}
            <div className="space-y-2">
              <Label htmlFor="orbitalPeriod" className="text-white">
                Orbital Period (days)
              </Label>
              <Input
                id="orbitalPeriod"
                type="number"
                step="0.01"
                value={formData.orbitalPeriod || ''}
                onChange={(e) => handleInputChange('orbitalPeriod', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter period in days"
              />
              {errors.orbitalPeriod !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transitDuration" className="text-white">
                Transit Duration (hours)
              </Label>
              <Input
                id="transitDuration"
                type="number"
                step="0.01"
                value={formData.transitDuration || ''}
                onChange={(e) => handleInputChange('transitDuration', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter duration in hours"
              />
              {errors.transitDuration !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="planetRadius" className="text-white">
                Planet Radius (Earth radii)
              </Label>
              <Input
                id="planetRadius"
                type="number"
                step="0.01"
                value={formData.planetRadius || ''}
                onChange={(e) => handleInputChange('planetRadius', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Relative to Earth radius"
              />
              {errors.planetRadius !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stellarRadius" className="text-white">
                Stellar Radius (Solar radii)
              </Label>
              <Input
                id="stellarRadius"
                type="number"
                step="0.01"
                value={formData.stellarRadius || ''}
                onChange={(e) => handleInputChange('stellarRadius', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Relative to Solar radius"
              />
              {errors.stellarRadius !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="equilibriumTemp" className="text-white">
                Equilibrium Temperature (K)
              </Label>
              <Input
                id="equilibriumTemp"
                type="number"
                step="1"
                value={formData.equilibriumTemp || ''}
                onChange={(e) => handleInputChange('equilibriumTemp', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Temperature in Kelvin"
              />
              {errors.equilibriumTemp !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="insolationFlux" className="text-white">
                Insolation Flux (relative to Earth)
              </Label>
              <Input
                id="insolationFlux"
                type="number"
                step="0.01"
                value={formData.insolationFlux || ''}
                onChange={(e) => handleInputChange('insolationFlux', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Relative to Earth flux"
              />
              {errors.insolationFlux !== undefined && (
                <p className="text-red-400 text-sm">Enter a valid value</p>
              )}
            </div>
          </div>

          {/* Отображение результата ML анализа */}
          {renderMLResult()}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={loadExampleData}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Example Data
            </Button>
            <Button
              type="submit"
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Analysis
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-white mb-2">Parameter Guide:</h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p><strong>Orbital Period:</strong> time for the planet to complete one orbit around its star</p>
            <p><strong>Transit Duration:</strong> time it takes for the planet to cross the star's disk</p>
            <p><strong>Planet Radius:</strong> size of the planet relative to Earth (1.0 = Earth size)</p>
            <p><strong>Stellar Radius:</strong> size of the star relative to the Sun</p>
            <p><strong>Equilibrium Temperature:</strong> theoretical surface temperature of the planet</p>
            <p><strong>Insolation Flux:</strong> amount of energy the planet receives from its star</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
