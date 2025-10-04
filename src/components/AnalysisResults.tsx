import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, RefreshCw, Target, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ResultsVisualization } from './ResultsVisualization';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AnalysisResult {
  id: number;
  data: any;
  classification: string;
  confidence: number;
  score: number;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onBack: () => void;
  onNewAnalysis: () => void;
}

export function AnalysisResults({ results, onBack, onNewAnalysis }: AnalysisResultsProps) {
  const getClassificationIcon = (classification: string) => {
    if (classification === 'Подтверждённая экзопланета') {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (classification === 'Кандидат в планеты') {
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    if (classification === 'Подтверждённая экзопланета') {
      return 'bg-green-600';
    } else if (classification === 'Кандидат в планеты') {
      return 'bg-yellow-600';
    } else {
      return 'bg-red-600';
    }
  };

  const confirmedCount = results.filter(r => r.classification === 'Подтверждённая экзопланета').length;
  const candidateCount = results.filter(r => r.classification === 'Кандидат в планеты').length;
  const falsePositiveCount = results.filter(r => r.classification === 'Ложноположительный результат').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Результаты анализа</h1>
          <p className="text-gray-400">Проанализировано объектов: {results.length}</p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button
            onClick={onNewAnalysis}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Новый анализ
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 mb-1">Подтверждённые экзопланеты</p>
                <p className="text-3xl text-white">{confirmedCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 mb-1">Кандидаты в планеты</p>
                <p className="text-3xl text-white">{candidateCount}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 mb-1">Ложноположительные</p>
                <p className="text-3xl text-white">{falsePositiveCount}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <ResultsVisualization results={results} />

      {/* Individual Results */}
      <Card className="bg-gray-900/50 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Детальные результаты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getClassificationIcon(result.classification)}
                    <div>
                      <h3 className="text-white text-lg">Объект #{result.id}</h3>
                      <Badge className={`${getClassificationColor(result.classification)} text-white`}>
                        {result.classification}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Уверенность</p>
                    <p className="text-2xl text-white">{result.confidence}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Уровень уверенности</span>
                    <span className="text-white">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Орбитальный период</p>
                    <p className="text-white">{result.data.orbitalPeriod.toFixed(2)} дней</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Длительность транзита</p>
                    <p className="text-white">{result.data.transitDuration.toFixed(2)} часов</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Радиус планеты</p>
                    <p className="text-white">{result.data.planetRadius.toFixed(2)} R⊕</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Радиус звезды</p>
                    <p className="text-white">{result.data.stellarRadius.toFixed(2)} R☉</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Температура</p>
                    <p className="text-white">{result.data.equilibriumTemp.toFixed(0)} K</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Поток излучения</p>
                    <p className="text-white">{result.data.insolationFlux.toFixed(2)} F⊕</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Info */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-2">Информация о модели</h3>
              <p className="text-gray-400 text-sm">
                Модель основана на данных NASA Kepler, K2 и TESS миссий
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-2xl">94%</p>
              <p className="text-gray-400 text-sm">Точность</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}