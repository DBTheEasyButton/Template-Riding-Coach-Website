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
  description: string;
  notes: string;
}

const exercisePatterns: ExercisePattern[] = [
  {
    id: 'walk-poles-basic',
    name: 'Walk Poles - Basic Setup',
    type: 'walk-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'pole', position: { x: 150, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 230, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 310, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 390, y: 380 }, width: 100, height: 8 },
      { type: 'finish', position: { x: 550, y: 400 } }
    ],
    measurements: [
      { from: { x: 200, y: 384 }, to: { x: 280, y: 384 }, distance: '0.8m', label: 'Walk Pole Distance' },
      { from: { x: 280, y: 384 }, to: { x: 360, y: 384 }, distance: '0.8m', label: '' },
      { from: { x: 360, y: 384 }, to: { x: 440, y: 384 }, distance: '0.8m', label: '' }
    ],
    description: 'Four walk poles with standard spacing for rhythm training',
    notes: 'Perfect for warming up and establishing rhythm. Adjust spacing ±10cm based on horse size.'
  },
  {
    id: 'trot-poles-line',
    name: 'Trot Poles - Straight Line',
    type: 'trot-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'pole', position: { x: 140, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 260, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 380, y: 380 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 500, y: 380 }, width: 100, height: 8 },
      { type: 'finish', position: { x: 650, y: 400 } }
    ],
    measurements: [
      { from: { x: 190, y: 384 }, to: { x: 310, y: 384 }, distance: '1.2m', label: 'Trot Pole Distance' },
      { from: { x: 310, y: 384 }, to: { x: 430, y: 384 }, distance: '1.2m', label: '' },
      { from: { x: 430, y: 384 }, to: { x: 550, y: 384 }, distance: '1.2m', label: '' }
    ],
    description: 'Four trot poles in a straight line for balance and rhythm',
    notes: 'Build confidence and improve stride consistency. Start at walk, progress to trot.'
  },
  {
    id: 'canter-poles-three',
    name: 'Canter Poles - Triple',
    type: 'canter-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'pole', position: { x: 150, y: 380 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 400, y: 380 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 650, y: 380 }, width: 120, height: 10 },
      { type: 'finish', position: { x: 800, y: 400 } }
    ],
    measurements: [
      { from: { x: 210, y: 384 }, to: { x: 460, y: 384 }, distance: '3.1m', label: 'Canter Pole Distance' },
      { from: { x: 460, y: 384 }, to: { x: 710, y: 384 }, distance: '3.1m', label: '' }
    ],
    description: 'Three canter poles for stride regulation and balance',
    notes: 'Improves canter quality and stride control. Approach in balanced canter.'
  },
  {
    id: 'gridwork-bounce-one',
    name: 'Gridwork - Bounce to One Stride',
    type: 'gridwork',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'jump', position: { x: 180, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 350, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 580, y: 370 }, width: 80, height: 30 },
      { type: 'finish', position: { x: 750, y: 400 } }
    ],
    measurements: [
      { from: { x: 260, y: 385 }, to: { x: 350, y: 385 }, distance: '3.1m', label: 'Bounce' },
      { from: { x: 430, y: 385 }, to: { x: 580, y: 385 }, distance: '6.2m', label: 'One Stride' }
    ],
    description: 'Bounce followed by one stride combination',
    notes: 'Systematic jumping training. Start with poles on ground, raise gradually.'
  },
  {
    id: 'gridwork-one-two',
    name: 'Gridwork - One to Two Stride',
    type: 'gridwork',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'jump', position: { x: 150, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 380, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 670, y: 370 }, width: 80, height: 30 },
      { type: 'finish', position: { x: 820, y: 400 } }
    ],
    measurements: [
      { from: { x: 230, y: 385 }, to: { x: 380, y: 385 }, distance: '6.2m', label: 'One Stride' },
      { from: { x: 460, y: 385 }, to: { x: 670, y: 385 }, distance: '9.3m', label: 'Two Strides' }
    ],
    description: 'One stride to two stride progression',
    notes: 'Develops horse\'s adjustability and rider\'s eye for distances.'
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
            {/* Ground line */}
            <line x1="0" y1="450" x2="900" y2="450" stroke="#22C55E" strokeWidth="2" />
            <text x="450" y="470" textAnchor="middle" className="fill-green-600 text-sm font-medium">
              Ground Line
            </text>

            {/* Horse path (dashed line) */}
            <line x1="50" y1="400" x2="850" y2="400" stroke="#6B7280" strokeWidth="2" strokeDasharray="10,5" />

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
                    x={element.position.x - (element.width || 100) / 2}
                    y={element.position.y}
                    width={element.width || 100}
                    height={element.height || 8}
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