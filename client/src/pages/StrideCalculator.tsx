import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Ruler, Users, Info } from "lucide-react";

type DistanceType = "walk-poles" | "trot-poles" | "canter-poles" | "gridwork" | "course-distances";
type StrideCount = "bounce" | "1-stride" | "2-stride" | "3-stride" | "4-stride" | "5-stride" | "6-stride";

interface StrideCalculation {
  distanceYards: number;
  distanceMeters: number;
  userSteps: number;
  description: string;
  notes: string;
  exerciseType?: string;
}

export default function StrideCalculator() {
  const [userHeight, setUserHeight] = useState<number>(170);
  const [distanceType, setDistanceType] = useState<DistanceType>("trot-poles");
  const [strideCount, setStrideCount] = useState<StrideCount>("1-stride");
  const [results, setResults] = useState<StrideCalculation[]>([]);

  // Standard distances in meters - Based on British Equestrian Federation guidelines
  const standardDistances = {
    "walk-poles": {
      "collected": { distance: 0.8, description: "Walk poles - collected spacing" },
      "standard": { distance: 0.9, description: "Walk poles - standard spacing" },
      "extended": { distance: 1.0, description: "Walk poles - extended spacing" }
    },
    "trot-poles": {
      "collected": { distance: 1.2, description: "Trot poles - collected for small stride" },
      "standard": { distance: 1.4, description: "Trot poles - standard spacing" },
      "extended": { distance: 1.6, description: "Trot poles - extended for big stride" },
      "young-horse": { distance: 1.3, description: "Trot poles - suitable for young horses" }
    },
    "canter-poles": {
      "bounce": { distance: 3.0, description: "Canter poles - bounce spacing" },
      "1-stride": { distance: 6.0, description: "Canter poles - one stride apart" },
      "2-stride": { distance: 9.0, description: "Canter poles - two strides apart" },
      "3-stride": { distance: 12.0, description: "Canter poles - three strides apart" },
      "4-stride": { distance: 15.0, description: "Canter poles - four strides apart" }
    },
    "gridwork": {
      "pole-to-fence-horses": { distance: 3.15, description: "Canter pole to fence - horses (2.80-3.50m average)" },
      "pole-to-fence-14-2": { distance: 2.90, description: "Canter pole to fence - 14'2hh ponies (2.70-3.10m average)" },
      "pole-to-fence-13-2": { distance: 2.65, description: "Canter pole to fence - 13'2hh ponies (2.40-2.90m average)" },
      "pole-to-fence-12-2": { distance: 2.30, description: "Canter pole to fence - 12'2hh ponies (2.10-2.50m average)" },
      "bounce": { distance: 3.5, description: "Grid bounce - jump to jump" },
      "1-stride": { distance: 7.3, description: "Grid one stride - between 80cm jumps" },
      "2-stride": { distance: 10.7, description: "Grid two strides - between 90cm jumps" },
      "3-stride": { distance: 14.0, description: "Grid three strides - between 1m jumps" },
      "4-stride": { distance: 17.4, description: "Grid four strides - between 1.10m jumps" },
      "5-stride": { distance: 20.7, description: "Grid five strides - between larger jumps" },
      "6-stride": { distance: 24.0, description: "Grid six strides - between larger jumps" }
    },
    "course-distances": {
      "1-stride": { distance: 24.4, description: "Course - one galloping stride (related distance)" },
      "2-stride": { distance: 35.0, description: "Course - two galloping strides (related distance)" },
      "3-stride": { distance: 45.7, description: "Course - three galloping strides (related distance)" },
      "4-stride": { distance: 56.4, description: "Course - four galloping strides (related distance)" },
      "5-stride": { distance: 67.1, description: "Course - five galloping strides (related distance)" },
      "6-stride": { distance: 77.7, description: "Course - six galloping strides (related distance)" }
    }
  };

  // Calculate user steps based on height (average step length)
  const calculateUserSteps = (heightCm: number, distanceMeters: number): number => {
    // Average step length formula: height * 0.43 (in cm), converted to meters
    const stepLengthMeters = (heightCm * 0.43) / 100;
    return Math.round(distanceMeters / stepLengthMeters);
  };

  const metersToYards = (meters: number): number => {
    return Math.round(meters * 1.094 * 10) / 10; // Convert and round to 1 decimal
  };

  const needsStrideSelection = () => {
    return distanceType === "canter-poles" || distanceType === "gridwork" || distanceType === "course-distances";
  };

  const calculateDistances = () => {
    const calculations: StrideCalculation[] = [];
    const distances = standardDistances[distanceType];

    if (needsStrideSelection()) {
      // For exercises that need stride selection, only show selected stride
      const selectedData = distances[strideCount as keyof typeof distances] as any;
      if (selectedData && selectedData.distance && selectedData.description) {
        const distanceMeters = selectedData.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(userHeight, distanceMeters);
        
        let notes = getNotesForDistanceType(distanceType);

        calculations.push({
          distanceYards,
          distanceMeters,
          userSteps,
          description: selectedData.description,
          notes,
          exerciseType: distanceType
        });
      }
    } else {
      // For walk/trot poles, show all variations
      Object.entries(distances as any).forEach(([key, data]: [string, any]) => {
        if (data.distance && data.description) {
          const distanceMeters = data.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(userHeight, distanceMeters);
          
          let notes = getNotesForDistanceType(distanceType);

          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: data.description,
            notes,
            exerciseType: distanceType
          });
        }
      });
    }

    setResults(calculations);
  };

  const getNotesForDistanceType = (type: DistanceType): string => {
    switch (type) {
      case "walk-poles":
        return "Measured from center of pole to center of pole. Horse should walk calmly with regular rhythm.";
      case "trot-poles":
        return "Measured from center of pole to center of pole. Maintain steady trot rhythm throughout.";
      case "canter-poles":
        return "Measured from center of pole to center of pole. Keep steady canter rhythm and balance.";
      case "gridwork":
        return "Measured from back of first element to front of second element. Adjust for jump height.";
      case "course-distances":
        return "Measured from back of first jump to front of second jump. Course-related distances.";
      default:
        return "";
    }
  };

  const calculateAllDistances = () => {
    const allCalculations: StrideCalculation[] = [];
    const distances = standardDistances[distanceType];

    Object.entries(distances as any).forEach(([key, data]: [string, any]) => {
      if (data.distance && data.description) {
        const distanceMeters = data.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(userHeight, distanceMeters);
        
        let notes = getNotesForDistanceType(distanceType);

        allCalculations.push({
          distanceYards,
          distanceMeters,
          userSteps,
          description: data.description,
          notes,
          exerciseType: distanceType
        });
      }
    });

    setResults(allCalculations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            Stride Distance Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate precise distances for poles and jumps based on your height. 
            Get measurements in both yards and meters, plus your personal step count.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Setup Calculator
              </CardTitle>
              <CardDescription>
                Enter your height and select the type of distance you need to measure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height">Your Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userHeight}
                  onChange={(e) => setUserHeight(Number(e.target.value))}
                  placeholder="170"
                  min="140"
                  max="220"
                />
                <p className="text-sm text-gray-500">
                  Used to calculate your personal step count
                </p>
              </div>

              <div className="space-y-2">
                <Label>Exercise Type</Label>
                <Select value={distanceType} onValueChange={(value: DistanceType) => setDistanceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-poles">Walk Poles</SelectItem>
                    <SelectItem value="trot-poles">Trot Poles</SelectItem>
                    <SelectItem value="canter-poles">Canter Poles</SelectItem>
                    <SelectItem value="gridwork">Gridwork Exercises</SelectItem>
                    <SelectItem value="course-distances">Course Distances</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {needsStrideSelection() && (
                <div className="space-y-2">
                  <Label>Number of Strides</Label>
                  <Select value={strideCount} onValueChange={(value: StrideCount) => setStrideCount(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bounce">Bounce (No Stride)</SelectItem>
                      <SelectItem value="1-stride">1 Stride</SelectItem>
                      <SelectItem value="2-stride">2 Strides</SelectItem>
                      <SelectItem value="3-stride">3 Strides</SelectItem>
                      <SelectItem value="4-stride">4 Strides</SelectItem>
                      {(distanceType === "gridwork" || distanceType === "course-distances") && (
                        <>
                          <SelectItem value="5-stride">5 Strides</SelectItem>
                          <SelectItem value="6-stride">6 Strides</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={calculateDistances} className="flex-1">
                  Calculate Selected
                </Button>
                <Button onClick={calculateAllDistances} variant="outline" className="flex-1">
                  Show All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Distance Results
              </CardTitle>
              <CardDescription>
                Precise measurements for setting up your {distanceType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Calculate" to see your distance measurements</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{result.description}</h3>
                          <Badge variant="outline">{distanceType}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {result.distanceMeters}m
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Meters</div>
                          </div>
                          
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {result.distanceYards}yd
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Yards</div>
                          </div>
                          
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                              <Users className="h-5 w-5" />
                              {result.userSteps}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Your Steps</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          {result.notes}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="max-w-6xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Exercise Guide & Safety Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Walk Poles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perfect for warming up and teaching rhythm. Use 4-6 poles. 
                  Adjust spacing for collected, standard, or extended walk.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">Trot Poles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build rhythm and balance. Use 4-8 poles. Start with standard spacing, 
                  adjust for horse's natural stride and training level.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Canter Poles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Improve canter quality and stride control. Use 3-5 poles. 
                  Start with single poles before creating sequences.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Gridwork</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Systematic jumping training. Includes canter pole to fence distances for horses and ponies. 
                  Add 15cm per 30cm jump height increase to distances.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">Course Distances</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Competition-standard related distances. Vary ±1-2m based on 
                  ground conditions, jump height, and horse's stride.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Measurement Guidelines</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Poles: Center to center measurement</li>
                  <li>• Gridwork: Back of first to front of second element</li>
                  <li>• Course: Back of first jump to front of second jump</li>
                  <li>• Use a measuring tape for accuracy</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Safety Reminders</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Always start with poles on the ground</li>
                  <li>• Build height and complexity gradually</li>
                  <li>• Adjust distances for individual horses</li>
                  <li>• Consider ground conditions and footing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}