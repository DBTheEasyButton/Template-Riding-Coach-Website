import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, Info } from 'lucide-react';

interface ExercisePattern {
  id: string;
  name: string;
  type: 'walk-poles' | 'trot-poles' | 'canter-poles' | 'gridwork';
  elements: Array<{
    type: 'pole' | 'jump' | 'start' | 'finish';
    position: { x: number; y: number };
    width?: number;
    height?: number;
  }>;
  measurements: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    distance: string;
    label: string;
  }>;
  path?: string; // SVG path for curved horse routes
  description: string;
  notes: string;
}

const exercisePatterns: ExercisePattern[] = [
  {
    id: 'basic-trot-poles',
    name: 'Basic Trot Poles',
    type: 'trot-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 250 } },
      { type: 'pole', position: { x: 200, y: 240 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 320, y: 240 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 440, y: 240 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 560, y: 240 }, width: 100, height: 8 },
      { type: 'finish', position: { x: 700, y: 250 } }
    ],
    path: 'M 50 240 L 700 240',
    measurements: [
      { from: { x: 200, y: 220 }, to: { x: 320, y: 220 }, distance: '1.2m', label: '' },
      { from: { x: 320, y: 220 }, to: { x: 440, y: 220 }, distance: '1.2m', label: '' },
      { from: { x: 440, y: 220 }, to: { x: 560, y: 220 }, distance: '1.2m', label: '' }
    ],
    description: 'Four trot poles in straight line',
    notes: 'Start at walk, progress to trot. Keep steady rhythm and straight line.'
  },
  {
    id: 'walk-poles',
    name: 'Walk Poles',
    type: 'walk-poles',
    elements: [
      { type: 'start', position: { x: 80, y: 250 } },
      { type: 'pole', position: { x: 200, y: 240 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 280, y: 240 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 360, y: 240 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 440, y: 240 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 520, y: 240 }, width: 80, height: 8 },
      { type: 'finish', position: { x: 650, y: 250 } }
    ],
    path: 'M 80 240 L 650 240',
    measurements: [
      { from: { x: 200, y: 220 }, to: { x: 280, y: 220 }, distance: '0.8m', label: '' },
      { from: { x: 280, y: 220 }, to: { x: 360, y: 220 }, distance: '0.8m', label: '' },
      { from: { x: 360, y: 220 }, to: { x: 440, y: 220 }, distance: '0.8m', label: '' }
    ],
    description: 'Five walk poles for rhythm training',
    notes: 'Perfect for warming up. Maintain steady walk rhythm throughout.'
  },
  {
    id: 'canter-poles',
    name: 'Canter Poles',
    type: 'canter-poles',
    elements: [
      { type: 'start', position: { x: 80, y: 250 } },
      { type: 'pole', position: { x: 250, y: 240 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 560, y: 240 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 870, y: 240 }, width: 120, height: 10 },
      { type: 'finish', position: { x: 1050, y: 250 } }
    ],
    path: 'M 80 240 L 1050 240',
    measurements: [
      { from: { x: 250, y: 220 }, to: { x: 560, y: 220 }, distance: '3.1m', label: '' },
      { from: { x: 560, y: 220 }, to: { x: 870, y: 220 }, distance: '3.1m', label: '' }
    ],
    description: 'Three canter poles for stride regulation',
    notes: 'Improves canter quality and stride control. Approach in balanced canter.'
  },
  {
    id: 'simple-grid',
    name: 'Simple Grid Exercise',
    type: 'gridwork',
    elements: [
      { type: 'start', position: { x: 80, y: 250 } },
      { type: 'jump', position: { x: 250, y: 240 }, width: 80, height: 20 },
      { type: 'jump', position: { x: 560, y: 240 }, width: 80, height: 20 },
      { type: 'jump', position: { x: 1180, y: 240 }, width: 80, height: 20 },
      { type: 'finish', position: { x: 1350, y: 250 } }
    ],
    path: 'M 80 240 L 1350 240',
    measurements: [
      { from: { x: 250, y: 220 }, to: { x: 560, y: 220 }, distance: '3.1m', label: '' },
      { from: { x: 560, y: 220 }, to: { x: 1180, y: 220 }, distance: '6.2m', label: '' }
    ],
    description: 'Bounce to one stride grid',
    notes: 'Start with poles on ground. Gradual progression to small jumps.'
  }
];

export function ExerciseDiagram() {
  const [currentExercise, setCurrentExercise] = useState<ExercisePattern>(exercisePatterns[0]);

  const generateRandomExercise = () => {
    const randomIndex = Math.floor(Math.random() * exercisePatterns.length);
    setCurrentExercise(exercisePatterns[randomIndex]);
  };

  const getElementColor = (type: string) => {
    switch (type) {
      case 'pole': return '#8B4513'; // Brown
      case 'jump': return '#DC2626'; // Red
      case 'start': return '#10B981'; // Green
      case 'finish': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'walk-poles': return 'text-blue-600 dark:text-blue-400';
      case 'trot-poles': return 'text-green-600 dark:text-green-400';
      case 'canter-poles': return 'text-orange-600 dark:text-orange-400';
      case 'gridwork': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Exercise Diagrams
            <Info className="h-5 w-5 text-gray-500" />
          </CardTitle>
          <Button onClick={generateRandomExercise} variant="outline" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Generate Exercise
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Info */}
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${getTypeColor(currentExercise.type)}`}>
            {currentExercise.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{currentExercise.description}</p>
        </div>

        {/* Diagram */}
        <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 overflow-x-auto">
          <svg width="900" height="500" viewBox="0 0 900 500" className="w-full h-auto">


            {/* Horse path (dashed line) */}
            {currentExercise.path ? (
              <path 
                d={currentExercise.path} 
                stroke="#6B7280" 
                strokeWidth="3" 
                strokeDasharray="10,5" 
                fill="none"
              />
            ) : (
              <line x1="50" y1="400" x2="850" y2="400" stroke="#6B7280" strokeWidth="2" strokeDasharray="10,5" />
            )}

            {/* Elements */}
            {currentExercise.elements.map((element, index) => {
              const color = getElementColor(element.type);
              
              if (element.type === 'start') {
                return (
                  <g key={index}>
                    <circle cx={element.position.x} cy={element.position.y} r="8" fill={color} />
                    <text x={element.position.x} y={element.position.y - 15} textAnchor="middle" className="fill-current text-sm font-medium">
                      START
                    </text>
                  </g>
                );
              } else if (element.type === 'finish') {
                return (
                  <g key={index}>
                    <circle cx={element.position.x} cy={element.position.y} r="8" fill={color} />
                    <text x={element.position.x} y={element.position.y - 15} textAnchor="middle" className="fill-current text-sm font-medium">
                      FINISH
                    </text>
                  </g>
                );
              } else if (element.type === 'pole') {
                return (
                  <rect
                    key={index}
                    x={element.position.x - (element.height || 8) / 2}
                    y={element.position.y - (element.width || 100) / 2}
                    width={element.height || 8}
                    height={element.width || 100}
                    fill={color}
                    rx="4"
                  />
                );
              } else if (element.type === 'jump') {
                return (
                  <g key={index}>
                    <rect
                      x={element.position.x - (element.width || 80) / 2}
                      y={element.position.y}
                      width={element.width || 80}
                      height={element.height || 30}
                      fill={color}
                      rx="4"
                    />
                    <text
                      x={element.position.x}
                      y={element.position.y - 5}
                      textAnchor="middle"
                      className="fill-current text-xs font-medium"
                    >
                      JUMP
                    </text>
                  </g>
                );
              }
              return null;
            })}

            {/* Measurements */}
            {currentExercise.measurements.map((measurement, index) => {
              const midX = (measurement.from.x + measurement.to.x) / 2;
              const midY = (measurement.from.y + measurement.to.y) / 2 - 20;
              
              return (
                <g key={index}>
                  {/* Measurement line */}
                  <line
                    x1={measurement.from.x}
                    y1={measurement.from.y - 10}
                    x2={measurement.to.x}
                    y2={measurement.to.y - 10}
                    stroke="#DC2626"
                    strokeWidth="2"
                  />
                  {/* Start marker */}
                  <line
                    x1={measurement.from.x}
                    y1={measurement.from.y - 15}
                    x2={measurement.from.x}
                    y2={measurement.from.y - 5}
                    stroke="#DC2626"
                    strokeWidth="2"
                  />
                  {/* End marker */}
                  <line
                    x1={measurement.to.x}
                    y1={measurement.to.y - 15}
                    x2={measurement.to.x}
                    y2={measurement.to.y - 5}
                    stroke="#DC2626"
                    strokeWidth="2"
                  />
                  {/* Distance label */}
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    className="fill-red-600 text-sm font-bold"
                  >
                    {measurement.distance}
                  </text>
                  {measurement.label && (
                    <text
                      x={midX}
                      y={midY + 15}
                      textAnchor="middle"
                      className="fill-red-500 text-xs"
                    >
                      {measurement.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Notes */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Training Notes</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">{currentExercise.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
}