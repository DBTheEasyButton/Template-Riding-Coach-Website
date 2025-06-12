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
type HorseSize = "horses" | "14-2" | "13-2" | "12-2";

interface StrideCalculation {
  distanceYards: number;
  distanceMeters: number;
  userSteps: number;
  description: string;
  notes: string;
  exerciseType?: string;
}

export default function StrideCalculator() {
  const [userFeet, setUserFeet] = useState<number>(5);
  const [userInches, setUserInches] = useState<number>(8);
  const [horseFeet, setHorseFeet] = useState<number>(16);
  const [horseInches, setHorseInches] = useState<number>(0);
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
      "1-stride-horses": { distance: 6.5, description: "1 stride - horses (6.00-7.00m)" },
      "1-stride-14-2": { distance: 6.4, description: "1 stride - 14'2hh ponies (5.90-6.90m)" },
      "1-stride-13-2": { distance: 6.05, description: "1 stride - 13'2hh ponies (5.70-6.40m)" },
      "1-stride-12-2": { distance: 5.5, description: "1 stride - 12'2hh ponies (5.20-5.80m)" },
      "2-stride-horses": { distance: 9.85, description: "2 strides - horses (9.50-10.20m)" },
      "2-stride-14-2": { distance: 9.7, description: "2 strides - 14'2hh ponies (9.40-10.00m)" },
      "2-stride-13-2": { distance: 8.9, description: "2 strides - 13'2hh ponies (8.60-9.20m)" },
      "2-stride-12-2": { distance: 7.95, description: "2 strides - 12'2hh ponies (7.70-8.20m)" },
      "3-stride-horses": { distance: 14.25, description: "3 strides - horses (13.50-15.00m)" },
      "3-stride-14-2": { distance: 13.25, description: "3 strides - 14'2hh ponies (12.50-14.00m)" },
      "3-stride-13-2": { distance: 12.25, description: "3 strides - 13'2hh ponies (11.50-13.00m)" },
      "3-stride-12-2": { distance: 11.25, description: "3 strides - 12'2hh ponies (10.50-12.00m)" },
      "4-stride-horses": { distance: 17.75, description: "4 strides - horses (17.00-18.50m)" },
      "4-stride-14-2": { distance: 16.35, description: "4 strides - 14'2hh ponies (15.70-17.00m)" },
      "4-stride-13-2": { distance: 15.25, description: "4 strides - 13'2hh ponies (14.50-16.00m)" },
      "4-stride-12-2": { distance: 13.75, description: "4 strides - 12'2hh ponies (13.00-14.50m)" },
      "5-stride-horses": { distance: 21.5, description: "5 strides - horses (20.50-22.50m)" },
      "5-stride-14-2": { distance: 19.75, description: "5 strides - 14'2hh ponies (19.00-20.50m)" },
      "5-stride-13-2": { distance: 18.25, description: "5 strides - 13'2hh ponies (17.50-19.00m)" },
      "5-stride-12-2": { distance: 16.6, description: "5 strides - 12'2hh ponies (15.70-17.50m)" },
      "6-stride-horses": { distance: 24.75, description: "6 strides - horses (23.50-26.00m)" },
      "6-stride-14-2": { distance: 22.75, description: "6 strides - 14'2hh ponies (22.00-23.50m)" },
      "6-stride-13-2": { distance: 21.0, description: "6 strides - 13'2hh ponies (20.00-22.00m)" },
      "6-stride-12-2": { distance: 19.75, description: "6 strides - 12'2hh ponies (19.00-20.50m)" },
      "7-stride-horses": { distance: 28.5, description: "7 strides - horses (27.00-30.00m)" },
      "7-stride-14-2": { distance: 26.0, description: "7 strides - 14'2hh ponies (25.00-27.00m)" },
      "7-stride-13-2": { distance: 24.0, description: "7 strides - 13'2hh ponies (23.00-25.00m)" },
      "7-stride-12-2": { distance: 22.0, description: "7 strides - 12'2hh ponies (21.00-23.00m)" }
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

  // Calculate user steps based on actual stride data
  const calculateUserSteps = (distanceMeters: number): number => {
    const strideInches = getStrideLength(userFeet, userInches);
    const strideMeters = strideInches * 0.0254; // Convert inches to meters
    return Math.round(distanceMeters / strideMeters);
  };

  const metersToYards = (meters: number): number => {
    return Math.round(meters * 1.094 * 10) / 10; // Convert and round to 1 decimal
  };

  // Convert feet and inches to centimeters
  const feetInchesToCm = (feet: number, inches: number): number => {
    const totalInches = (feet * 12) + inches;
    return Math.round(totalInches * 2.54);
  };

  // Get horse height in cm from feet and inches inputs
  const getHorseHeightCm = (): number => {
    return feetInchesToCm(horseFeet, horseInches);
  };

  // Get user height in cm from feet and inches inputs
  const getUserHeightCm = (): number => {
    return feetInchesToCm(userFeet, userInches);
  };

  // Determine horse size category based on height in cm
  const getHorseSizeFromHeight = (heightCm: number): HorseSize => {
    if (heightCm < 128) return "12-2"; // Under 12.2hh
    if (heightCm < 138) return "12-2"; // 12.2hh (128cm)
    if (heightCm < 148) return "13-2"; // 13.2hh (138cm)
    if (heightCm < 158) return "14-2"; // 14.2hh (148cm)
    return "horses"; // 15hh and above
  };

  const needsStrideSelection = () => {
    return distanceType === "canter-poles" || distanceType === "gridwork" || distanceType === "course-distances";
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
        const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
        
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
      // For gridwork, show both horse size specific pole-to-fence and stride-based exercises
      if (strideCount === "bounce") {
        // Show pole-to-fence distances for horse size based on height
        const poleToFenceKey = `pole-to-fence-${horseSizeCategory}`;
        const poleToFenceData = distances[poleToFenceKey as keyof typeof distances] as any;
        if (poleToFenceData) {
          const distanceMeters = poleToFenceData.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
          
          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: poleToFenceData.description,
            notes: getNotesForDistanceType(distanceType),
            exerciseType: distanceType
          });
        }
      }
      
      // Show standard gridwork distance for selected stride
      const selectedData = distances[strideCount as keyof typeof distances] as any;
      if (selectedData && selectedData.distance && selectedData.description) {
        const distanceMeters = selectedData.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
        
        calculations.push({
          distanceYards,
          distanceMeters,
          userSteps,
          description: selectedData.description,
          notes: getNotesForDistanceType(distanceType),
          exerciseType: distanceType
        });
      }
    } else if (needsStrideSelection()) {
      // For canter poles
      const selectedData = distances[strideCount as keyof typeof distances] as any;
      if (selectedData && selectedData.distance && selectedData.description) {
        const distanceMeters = selectedData.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
        
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
      // For walk/trot poles, show all variations
      Object.entries(distances as any).forEach(([key, data]: [string, any]) => {
        if (data.distance && data.description) {
          const distanceMeters = data.distance;
          const distanceYards = metersToYards(distanceMeters);
          const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
          
          calculations.push({
            distanceYards,
            distanceMeters,
            userSteps,
            description: data.description,
            notes: getNotesForDistanceType(distanceType),
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
        const userSteps = calculateUserSteps(getUserHeightCm(), distanceMeters);
        
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
                      id="horse-feet"
                      type="number"
                      value={horseFeet}
                      onChange={(e) => setHorseFeet(Number(e.target.value))}
                      placeholder="16"
                      min="10"
                      max="18"
                    />
                    <p className="text-xs text-gray-500 mt-1">Feet</p>
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
                  16.0hh, 15.2hh, 14.2hh, 13.2hh, 12.2hh
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