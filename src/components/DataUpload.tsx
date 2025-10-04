import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { PlanetData } from './DataAnalysis';

interface DataUploadProps {
  onDataUpload: (data: PlanetData[]) => void;
}

export function DataUpload({ onDataUpload }: DataUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Simulate file processing and generate sample data
    setTimeout(() => {
      const sampleData: PlanetData[] = [
        {
          orbitalPeriod: 365.25,
          transitDuration: 6.2,
          planetRadius: 1.0,
          stellarRadius: 1.0,
          equilibriumTemp: 288,
          insolationFlux: 1.0
        },
        {
          orbitalPeriod: 88.0,
          transitDuration: 3.1,
          planetRadius: 0.38,
          stellarRadius: 0.95,
          equilibriumTemp: 464,
          insolationFlux: 6.7
        },
        {
          orbitalPeriod: 687.0,
          transitDuration: 8.9,
          planetRadius: 0.53,
          stellarRadius: 1.1,
          equilibriumTemp: 227,
          insolationFlux: 0.43
        }
      ];
      
      setUploaded(true);
      onDataUpload(sampleData);
    }, 1000);
  };

  const loadSampleData = () => {
    const sampleData: PlanetData[] = [
      {
        orbitalPeriod: 3.21,
        transitDuration: 2.8,
        planetRadius: 1.15,
        stellarRadius: 0.89,
        equilibriumTemp: 1420,
        insolationFlux: 580
      },
      {
        orbitalPeriod: 84.3,
        transitDuration: 5.7,
        planetRadius: 2.3,
        stellarRadius: 1.2,
        equilibriumTemp: 542,
        insolationFlux: 4.2
      }
    ];
    
    setUploaded(true);
    onDataUpload(sampleData);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Data Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : uploaded
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploaded ? (
              <div className="text-green-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg mb-2">File uploaded successfully!</p>
                <p className="text-sm text-gray-400">Data ready for analysis</p>
              </div>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2 text-white">
                  Drag & drop CSV/Excel file here
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  or click to select file
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Choose File
                  </Button>
                </label>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-white mb-2">Expected data format:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Orbital period (days)</li>
              <li>• Transit duration (hours)</li>
              <li>• Planet radius (Earth radii)</li>
              <li>• Stellar radius (Solar radii)</li>
              <li>• Equilibrium temperature (K)</li>
              <li>• Insolation flux (relative to Earth)</li>
            </ul>
          </div>

          <div className="mt-4">
            <Button
              onClick={loadSampleData}
              variant="secondary"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}