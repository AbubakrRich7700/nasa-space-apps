import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

interface AnalysisResult {
  id: number;
  data: any;
  classification: string;
  confidence: number;
  score: number;
}

interface ResultsVisualizationProps {
  results: AnalysisResult[];
}

export function ResultsVisualization({ results }: ResultsVisualizationProps) {
  // Prepare data for charts
  const classificationData = [
    {
      name: 'Подтверждённые экзопланеты',
      count: results.filter(r => r.classification === 'Подтверждённая экзопланета').length,
      color: '#22c55e'
    },
    {
      name: 'Кандидаты в планеты',
      count: results.filter(r => r.classification === 'Кандидат в планеты').length,
      color: '#eab308'
    },
    {
      name: 'Ложноположительные',
      count: results.filter(r => r.classification === 'Ложноположительный результат').length,
      color: '#ef4444'
    }
  ];

  const confidenceData = results.map((result, index) => ({
    name: `Объект ${result.id}`,
    confidence: result.confidence,
    classification: result.classification
  }));

  const scatterData = results.map(result => ({
    x: result.data.orbitalPeriod,
    y: result.data.planetRadius,
    classification: result.classification,
    confidence: result.confidence
  }));

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white">{`${label}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white">{`Период: ${data.x.toFixed(2)} дней`}</p>
          <p className="text-white">{`Радиус: ${data.y.toFixed(2)} R⊕`}</p>
          <p className="text-white">{`Уверенность: ${data.confidence}%`}</p>
          <p className="text-white">{data.classification}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Classification Distribution */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Распределение классификации</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {classificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#ffffff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Уровень уверенности</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="confidence" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orbital Period vs Planet Radius Scatter */}
      <Card className="bg-gray-900/50 border-gray-700 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Орбитальный период vs Радиус планеты</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Орбитальный период" 
                unit=" дней"
                stroke="#9ca3af"
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Радиус планеты" 
                unit=" R⊕"
                stroke="#9ca3af"
              />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter 
                name="Экзопланеты" 
                data={scatterData.filter(d => d.classification === 'Подтверждённая экзопланета')}
                fill="#22c55e" 
              />
              <Scatter 
                name="Кандидаты" 
                data={scatterData.filter(d => d.classification === 'Кандидат в планеты')}
                fill="#eab308" 
              />
              <Scatter 
                name="Ложноположительные" 
                data={scatterData.filter(d => d.classification === 'Ложноположительный результат')}
                fill="#ef4444" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}