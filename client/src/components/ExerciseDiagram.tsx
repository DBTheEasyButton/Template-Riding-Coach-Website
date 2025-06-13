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
    id: 'figure-eight-poles',
    name: 'Figure-8 Pole Pattern',
    type: 'walk-poles',
    elements: [
      { type: 'start', position: { x: 100, y: 200 } },
      { type: 'pole', position: { x: 250, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 350, y: 150 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 450, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 350, y: 250 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 550, y: 200 }, width: 80, height: 8 },
      { type: 'finish', position: { x: 650, y: 200 } }
    ],
    path: 'M 100 200 Q 200 180 250 200 Q 300 120 350 150 Q 400 180 450 200 Q 500 220 550 200 Q 600 200 650 200',
    measurements: [
      { from: { x: 290, y: 204 }, to: { x: 390, y: 154 }, distance: '0.8m', label: 'Curved spacing' },
      { from: { x: 390, y: 204 }, to: { x: 490, y: 204 }, distance: '0.8m', label: '' }
    ],
    description: 'Figure-8 pattern with curved pole placement for suppleness',
    notes: 'Improves bend, balance and coordination. Ride in both directions.'
  },
  {
    id: 'star-spider-pattern',
    name: 'Spider/Star Pole Configuration',
    type: 'trot-poles',
    elements: [
      { type: 'start', position: { x: 100, y: 250 } },
      { type: 'pole', position: { x: 300, y: 250 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 400, y: 200 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 500, y: 150 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 500, y: 250 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 500, y: 350 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 400, y: 300 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 600, y: 200 }, width: 100, height: 8 },
      { type: 'pole', position: { x: 600, y: 300 }, width: 100, height: 8 },
      { type: 'finish', position: { x: 750, y: 250 } }
    ],
    path: 'M 100 250 L 300 250 L 400 200 L 500 150 M 500 150 L 600 200 M 400 200 L 500 250 L 600 250 M 500 250 L 500 350 M 500 350 L 400 300 M 600 300 L 750 250',
    measurements: [
      { from: { x: 350, y: 254 }, to: { x: 450, y: 204 }, distance: '1.2m', label: 'Radiating pattern' },
      { from: { x: 450, y: 254 }, to: { x: 550, y: 154 }, distance: '1.2m', label: '' }
    ],
    description: 'Star/spider configuration with multiple approach angles',
    notes: 'Develops straightness and accuracy. Multiple routes through center.'
  },
  {
    id: 'curved-approach',
    name: 'Curved Approach Pattern',
    type: 'trot-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 350 } },
      { type: 'pole', position: { x: 200, y: 300 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 300, y: 250 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 400, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 500, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 600, y: 250 }, width: 80, height: 8 },
      { type: 'finish', position: { x: 750, y: 350 } }
    ],
    path: 'M 50 350 Q 125 325 200 300 Q 250 275 300 250 Q 350 225 400 200 L 500 200 Q 550 225 600 250 Q 675 300 750 350',
    measurements: [
      { from: { x: 240, y: 304 }, to: { x: 340, y: 254 }, distance: '1.2m', label: 'Curved line' },
      { from: { x: 440, y: 204 }, to: { x: 540, y: 204 }, distance: '1.2m', label: '' }
    ],
    description: 'Curved line of poles for suppleness and bend',
    notes: 'Encourages natural bend through turns. Great for lateral work preparation.'
  },
  {
    id: 'fan-pattern',
    name: 'Fan Pole Exercise',
    type: 'canter-poles',
    elements: [
      { type: 'start', position: { x: 100, y: 400 } },
      { type: 'pole', position: { x: 300, y: 350 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 400, y: 320 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 500, y: 300 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 600, y: 290 }, width: 120, height: 10 },
      { type: 'pole', position: { x: 700, y: 285 }, width: 120, height: 10 },
      { type: 'finish', position: { x: 850, y: 280 } }
    ],
    path: 'M 100 400 Q 200 375 300 350 Q 350 335 400 320 Q 450 310 500 300 Q 550 295 600 290 Q 650 287 700 285 Q 775 282 850 280',
    measurements: [
      { from: { x: 360, y: 354 }, to: { x: 460, y: 324 }, distance: '3.1m', label: 'Fan spacing' },
      { from: { x: 560, y: 304 }, to: { x: 660, y: 294 }, distance: '3.1m', label: '' }
    ],
    description: 'Fan-shaped pole arrangement for adjustability training',
    notes: 'Teaches horse to adjust stride length. Wider spacing on outside, closer inside.'
  },
  {
    id: 'gridwork-l-shape',
    name: 'L-Shaped Grid Exercise',
    type: 'gridwork',
    elements: [
      { type: 'start', position: { x: 50, y: 400 } },
      { type: 'jump', position: { x: 200, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 350, y: 370 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 500, y: 270 }, width: 80, height: 30 },
      { type: 'jump', position: { x: 650, y: 170 }, width: 80, height: 30 },
      { type: 'finish', position: { x: 800, y: 120 } }
    ],
    path: 'M 50 400 L 200 370 L 350 370 Q 425 320 500 270 Q 575 220 650 170 L 800 120',
    measurements: [
      { from: { x: 280, y: 385 }, to: { x: 350, y: 385 }, distance: '3.1m', label: 'Bounce' },
      { from: { x: 540, y: 274 }, to: { x: 690, y: 174 }, distance: '6.2m', label: 'One stride turn' }
    ],
    description: 'L-shaped grid with change of direction',
    notes: 'Combines straight line jumping with turning. Develops balance and control.'
  },
  {
    id: 'circle-poles',
    name: 'Circle Pole Exercise',
    type: 'walk-poles',
    elements: [
      { type: 'start', position: { x: 150, y: 250 } },
      { type: 'pole', position: { x: 300, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 400, y: 180 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 500, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 550, y: 250 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 500, y: 300 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 400, y: 320 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 300, y: 300 }, width: 80, height: 8 },
      { type: 'finish', position: { x: 250, y: 250 } }
    ],
    path: 'M 150 250 Q 225 225 300 200 Q 350 190 400 180 Q 450 190 500 200 Q 525 225 550 250 Q 525 275 500 300 Q 450 310 400 320 Q 350 310 300 300 Q 275 275 250 250',
    measurements: [
      { from: { x: 340, y: 204 }, to: { x: 440, y: 184 }, distance: '0.8m', label: 'Circle spacing' },
      { from: { x: 504, y: 254 }, to: { x: 544, y: 304 }, distance: '0.8m', label: '' }
    ],
    description: 'Circular pole pattern for bend and rhythm',
    notes: 'Maintains consistent rhythm on curved lines. Great for suppleness work.'
  },
  {
    id: 'zigzag-pattern',
    name: 'Zigzag Pole Challenge',
    type: 'trot-poles',
    elements: [
      { type: 'start', position: { x: 50, y: 300 } },
      { type: 'pole', position: { x: 200, y: 200 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 300, y: 350 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 450, y: 180 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 550, y: 380 }, width: 80, height: 8 },
      { type: 'pole', position: { x: 700, y: 220 }, width: 80, height: 8 },
      { type: 'finish', position: { x: 850, y: 300 } }
    ],
    path: 'M 50 300 Q 125 250 200 200 Q 250 275 300 350 Q 375 265 450 180 Q 500 280 550 380 Q 625 300 700 220 Q 775 260 850 300',
    measurements: [
      { from: { x: 240, y: 204 }, to: { x: 340, y: 354 }, distance: '1.2m', label: 'Zigzag pattern' },
      { from: { x: 490, y: 184 }, to: { x: 590, y: 384 }, distance: '1.2m', label: '' }
    ],
    description: 'Zigzag pattern for agility and responsiveness',
    notes: 'Improves quick changes of direction and rider coordination.'
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