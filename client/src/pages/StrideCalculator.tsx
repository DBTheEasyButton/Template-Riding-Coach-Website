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
type StrideCount = "bounce" | "1-stride" | "2-stride" | "3-stride" | "4-stride" | "5-stride" | "6-stride" | "7-stride";
type HorseSize = "small-pony" | "big-pony" | "small-horse" | "big-horse";

interface StrideCalculation {
  distanceYards: number;
  distanceMeters: number;
  userSteps: string;
  description: string;
  notes: string;
  exerciseType?: string;
}

export default function StrideCalculator() {
  const [userFeet, setUserFeet] = useState<number>(5);
  const [userInches, setUserInches] = useState<number>(8);
  const [horseHands, setHorseHands] = useState<number>(16);
  const [horseInches, setHorseInches] = useState<number>(0);
  const [distanceType, setDistanceType] = useState<DistanceType>("trot-poles");
  const [strideCount, setStrideCount] = useState<StrideCount>("1-stride");
  const [results, setResults] = useState<StrideCalculation[]>([]);

  // Standard distances in meters - Dan Bizzarro Method official guidelines
  const standardDistances = {
    "walk-poles": {
      "small-pony": { distance: 0.6, description: "Walk poles - small pony (<13hh): 60cm" },
      "big-pony": { distance: 0.7, description: "Walk poles - big pony (13-14.2hh): 70cm" },
      "small-horse": { distance: 0.8, description: "Walk poles - small horse (14.3-16hh): 80cm" },
      "big-horse": { distance: 0.9, description: "Walk poles - big horse (16.1hh+): 90cm" }
    },
    "trot-poles": {
      "small-pony": { distance: 0.8, description: "Trot poles - small pony (<13hh): 80cm" },
      "big-pony": { distance: 1.0, description: "Trot poles - big pony (13-14.2hh): 1.0m" },
      "small-horse": { distance: 1.2, description: "Trot poles - small horse (14.3-16hh): 1.2m" },
      "big-horse": { distance: 1.4, description: "Trot poles - big horse (16.1hh+): 1.4m" }
    },
    "canter-poles": {
      "small-pony": { distance: 2.7, description: "Canter poles - small pony (<13hh): 2.7m" },
      "big-pony": { distance: 2.9, description: "Canter poles - big pony (13-14.2hh): 2.9m" },
      "small-horse": { distance: 3.1, description: "Canter poles - small horse (14.3-16hh): 3.1m" },
      "big-horse": { distance: 3.4, description: "Canter poles - big horse (16.1hh+): 3.4m" }
    },
    "gridwork": {
      "small-pony": { distance: 2.7, description: "Gridwork bounce - small pony (<13hh): 2.7m" },
      "big-pony": { distance: 2.9, description: "Gridwork bounce - big pony (13-14.2hh): 2.9m" },
      "small-horse": { distance: 3.1, description: "Gridwork bounce - small horse (14.3-16hh): 3.1m" },
      "big-horse": { distance: 3.4, description: "Gridwork bounce - big horse (16.1hh+): 3.4m" },
      "1-stride-small-pony": { distance: 5.4, description: "Gridwork 1 stride - small pony (<13hh): 5.4m" },
      "1-stride-big-pony": { distance: 5.8, description: "Gridwork 1 stride - big pony (13-14.2hh): 5.8m" },
      "1-stride-small-horse": { distance: 6.2, description: "Gridwork 1 stride - small horse (14.3-16hh): 6.2m" },
      "1-stride-big-horse": { distance: 6.8, description: "Gridwork 1 stride - big horse (16.1hh+): 6.8m" },
      "2-stride-small-pony": { distance: 8.1, description: "Gridwork 2 strides - small pony (<13hh): 8.1m" },
      "2-stride-big-pony": { distance: 8.7, description: "Gridwork 2 strides - big pony (13-14.2hh): 8.7m" },
      "2-stride-small-horse": { distance: 9.3, description: "Gridwork 2 strides - small horse (14.3-16hh): 9.3m" },
      "2-stride-big-horse": { distance: 10.2, description: "Gridwork 2 strides - big horse (16.1hh+): 10.2m" },
      "3-stride-small-pony": { distance: 10.8, description: "Gridwork 3 strides - small pony (<13hh): 10.8m" },
      "3-stride-big-pony": { distance: 11.6, description: "Gridwork 3 strides - big pony (13-14.2hh): 11.6m" },
      "3-stride-small-horse": { distance: 12.4, description: "Gridwork 3 strides - small horse (14.3-16hh): 12.4m" },
      "3-stride-big-horse": { distance: 13.6, description: "Gridwork 3 strides - big horse (16.1hh+): 13.6m" }
    },
    "course-distances": {
      "1-stride-small-pony": { distance: 6.5, description: "1 stride" },
      "1-stride-big-pony": { distance: 6.7, description: "1 stride" },
      "1-stride-small-horse": { distance: 6.9, description: "1 stride" },
      "1-stride-big-horse": { distance: 7.2, description: "1 stride" },
      "2-stride-small-pony": { distance: 10.0, description: "2 strides" },
      "2-stride-big-pony": { distance: 10.3, description: "2 strides" },
      "2-stride-small-horse": { distance: 10.7, description: "2 strides" },
      "2-stride-big-horse": { distance: 11.0, description: "2 strides" },
      "3-stride-small-pony": { distance: 13.0, description: "3 strides" },
      "3-stride-big-pony": { distance: 13.7, description: "3 strides" },
      "3-stride-small-horse": { distance: 14.3, description: "3 strides" },
      "3-stride-big-horse": { distance: 15.0, description: "3 strides" },
      "4-stride-small-pony": { distance: 16.5, description: "4 strides" },
      "4-stride-big-pony": { distance: 17.2, description: "4 strides" },
      "4-stride-small-horse": { distance: 17.8, description: "4 strides" },
      "4-stride-big-horse": { distance: 18.5, description: "4 strides" },
      "5-stride-small-pony": { distance: 20.0, description: "5 strides" },
      "5-stride-big-pony": { distance: 20.7, description: "5 strides" },
      "5-stride-small-horse": { distance: 21.3, description: "5 strides" },
      "5-stride-big-horse": { distance: 22.0, description: "5 strides" },
      "6-stride-small-pony": { distance: 23.5, description: "6 strides" },
      "6-stride-big-pony": { distance: 24.2, description: "6 strides" },
      "6-stride-small-horse": { distance: 24.8, description: "6 strides" },
      "6-stride-big-horse": { distance: 25.5, description: "6 strides" },
      "7-stride-small-pony": { distance: 27.0, description: "7 strides" },
      "7-stride-big-pony": { distance: 27.7, description: "7 strides" },
      "7-stride-small-horse": { distance: 28.3, description: "7 strides" },
      "7-stride-big-horse": { distance: 29.0, description: "7 strides" }
    }
  };

  // Get stride length in inches based on height (from your provided data)
  const getStrideLength = (feet: number, inches: number): number => {
    const totalInches = (feet * 12) + inches;
    
    // Based on your stride data table
    if (totalInches <= 60) return 25; // 5'0"
    if (totalInches <= 61) return 25; // 5'1"
    if (totalInches <= 62) return 26; // 5'2"
    if (totalInches <= 63) return 26; // 5'3"
    if (totalInches <= 64) return 26; // 5'4"
    if (totalInches <= 65) return 27; // 5'5"
    if (totalInches <= 66) return 27; // 5'6"
    if (totalInches <= 67) return 28; // 5'7"
    if (totalInches <= 68) return 28; // 5'8"
    if (totalInches <= 69) return 28; // 5'9"
    if (totalInches <= 70) return 29; // 5'10"
    if (totalInches <= 71) return 29; // 5'11"
    if (totalInches <= 72) return 30; // 6'0"
    if (totalInches <= 73) return 30; // 6'1"
    if (totalInches <= 74) return 31; // 6'2"
    if (totalInches <= 75) return 31; // 6'3"
    if (totalInches <= 76) return 31; // 6'4"
    if (totalInches <= 77) return 32; // 6'5"
    return 32; // 6'5"+
  };

  // Simplified step calculation based on user height and exercise type
  const calculateUserSteps = (exerciseType: DistanceType, strideCount?: StrideCount): string => {
    const userHeightInches = (userFeet * 12) + userInches;
    const isTallUser = userHeightInches >= 81; // 6'9" or taller
    
    switch (exerciseType) {
      case "walk-poles":
        return isTallUser ? "1 small step" : "1 normal step";
        
      case "trot-poles":
        return isTallUser ? "1 decent step" : "1 big step";
        
      case "canter-poles":
        return isTallUser ? "3 decent steps" : "3 big steps";
        
      case "gridwork":
        if (strideCount === "bounce") {
          return isTallUser ? "3 big steps" : "4 steps";
        } else {
          const strideNumber = parseInt(strideCount?.split('-')[0] || "1");
          const baseSteps = isTallUser ? 3 : 4;
          const additionalSteps = (strideNumber - 1) * 3; // Add 3 steps per stride after bounce
          return isTallUser ? `${baseSteps + additionalSteps} big steps` : `${baseSteps + additionalSteps} steps`;
        }
        
      case "course-distances":
        if (strideCount) {
          const strideNumber = parseInt(strideCount?.split('-')[0] || "1");
          const totalSteps = 2 + (strideNumber * 4) + 1; // 2 + (4 per stride) + 1
          return isTallUser ? `${totalSteps} decent steps` : `${totalSteps} big steps`;
        }
        return isTallUser ? "decent steps" : "big steps";
        
      default:
        return isTallUser ? "decent steps" : "big steps";
    }
  };

  const metersToYards = (meters: number): number => {
    return Math.round(meters * 1.094 * 10) / 10; // Convert and round to 1 decimal
  };

  // Convert feet and inches to centimeters
  const feetInchesToCm = (feet: number, inches: number): number => {
    const totalInches = (feet * 12) + inches;
    return Math.round(totalInches * 2.54);
  };

  // Get horse height in cm from hands and inches inputs
  const getHorseHeightCm = (): number => {
    const totalInches = (horseHands * 4) + horseInches; // 1 hand = 4 inches
    return Math.round(totalInches * 2.54); // Convert to cm
  };

  // Get user height in cm from feet and inches inputs
  const getUserHeightCm = (): number => {
    return feetInchesToCm(userFeet, userInches);
  };

  // Determine horse size category based on height in cm - Dan Bizzarro Method
  const getHorseSizeFromHeight = (heightCm: number): HorseSize => {
    if (heightCm < 132) return "small-pony"; // Under 13hh (132cm)
    if (heightCm < 149) return "big-pony"; // 13-14.2hh (132-148cm)
    if (heightCm < 165) return "small-horse"; // 14.3-16hh (149-164cm)
    return "big-horse"; // 16.1hh+ (165cm+)
  };

  // Get appropriate trot pole key based on horse size
  const getTrotPoleKey = (horseSizeCategory: HorseSize): string => {
    return horseSizeCategory; // Direct mapping since keys match
  };

  const needsStrideSelection = () => {
    return distanceType === "gridwork" || distanceType === "course-distances";
  };

  const needsHorseSizeSelection = () => {
    return distanceType === "gridwork" || distanceType === "course-distances";
  };

  const calculateDistances = () => {
    const calculations: StrideCalculation[] = [];
    const distances = standardDistances[distanceType];
    const horseHeightCm = getHorseHeightCm();
    const horseSizeCategory = getHorseSizeFromHeight(horseHeightCm);



    if (distanceType === "course-distances") {
      // For course distances, filter by stride count and horse size
      const keyPattern = `${strideCount}-${horseSizeCategory}`;
      const selectedData = distances[keyPattern as keyof typeof distances] as any;
      if (selectedData && selectedData.distance && selectedData.description) {
        const distanceMeters = selectedData.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(distanceType, strideCount);
        
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
    } else if (distanceType === "gridwork") {
      // For gridwork, use horse size category and stride count
      if (strideCount === "bounce") {
        // Show bounce distance for horse size
        const selectedData = distances[horseSizeCategory as keyof typeof distances] as any;
        if (selectedData && selectedData.distance && selectedData.description) {
          const distanceMeters = selectedData.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(distanceType, strideCount);
          
          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: selectedData.description,
            notes: getNotesForDistanceType(distanceType),
            exerciseType: distanceType
          });
        }
      } else {
        // Show stride-based distance for horse size
        const keyPattern = `${strideCount}-${horseSizeCategory}`;
        const selectedData = distances[keyPattern as keyof typeof distances] as any;
        if (selectedData && selectedData.distance && selectedData.description) {
          const distanceMeters = selectedData.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(distanceType, strideCount);
          
          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: selectedData.description,
            notes: getNotesForDistanceType(distanceType),
            exerciseType: distanceType
          });
        }
      }
    } else if (needsStrideSelection()) {
      // For canter poles
      const selectedData = distances[strideCount as keyof typeof distances] as any;
      if (selectedData && selectedData.distance && selectedData.description) {
        const distanceMeters = selectedData.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(distanceType, strideCount);
        
        calculations.push({
          distanceYards,
          distanceMeters,
          userSteps,
          description: selectedData.description,
          notes: getNotesForDistanceType(distanceType),
          exerciseType: distanceType
        });
      }
    } else {
      // For walk, trot, and canter poles, use horse size category
      if (distanceType === "walk-poles" || distanceType === "trot-poles" || distanceType === "canter-poles") {
        const selectedData = distances[horseSizeCategory as keyof typeof distances] as any;
        if (selectedData && selectedData.distance && selectedData.description) {
          const distanceMeters = selectedData.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(distanceType);
          
          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: selectedData.description,
            notes: getNotesForDistanceType(distanceType),
            exerciseType: distanceType
          });
        }
      }
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
        const userSteps = calculateUserSteps(distanceType);
        
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
                Enter your height and your horse's height to get precise distance measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-height">Your Height</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="user-feet"
                      type="number"
                      value={userFeet}
                      onChange={(e) => setUserFeet(Number(e.target.value))}
                      placeholder="5"
                      min="4"
                      max="7"
                    />
                    <p className="text-xs text-gray-500 mt-1">Feet</p>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="user-inches"
                      type="number"
                      value={userInches}
                      onChange={(e) => setUserInches(Number(e.target.value))}
                      placeholder="8"
                      min="0"
                      max="11"
                    />
                    <p className="text-xs text-gray-500 mt-1">Inches</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Used to calculate your personal step count
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horse-height">Horse Height</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="horse-hands"
                      type="number"
                      value={horseHands}
                      onChange={(e) => setHorseHands(Number(e.target.value))}
                      placeholder="16"
                      min="10"
                      max="18"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hands</p>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="horse-inches"
                      type="number"
                      value={horseInches}
                      onChange={(e) => setHorseInches(Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      max="11"
                    />
                    <p className="text-xs text-gray-500 mt-1">Inches</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enter your horse's exact height for accurate pole spacing
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

                      <SelectItem value="1-stride">1 Stride</SelectItem>
                      <SelectItem value="2-stride">2 Strides</SelectItem>
                      <SelectItem value="3-stride">3 Strides</SelectItem>
                      <SelectItem value="4-stride">4 Strides</SelectItem>
                      {(distanceType === "gridwork" || distanceType === "course-distances") && (
                        <>
                          <SelectItem value="5-stride">5 Strides</SelectItem>
                          <SelectItem value="6-stride">6 Strides</SelectItem>
                          {distanceType === "course-distances" && (
                            <SelectItem value="7-stride">7 Strides</SelectItem>
                          )}
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