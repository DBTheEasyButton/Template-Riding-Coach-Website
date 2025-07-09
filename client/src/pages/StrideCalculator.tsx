import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Ruler, Users, Info, AlertTriangle, ArrowLeft } from "lucide-react";
import { ExerciseDiagram } from "@/components/ExerciseDiagram";
import { Link } from "wouter";
import { standardDistances, getStrideLength } from "@/data/strideData";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
        return isTallUser ? "3 big steps" : "4 steps";
        
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

  const strideCalculatorStructuredData = {
    name: "Equestrian Stride Calculator",
    description: "Professional stride distance calculator for horse training and course design",
    url: "https://dan-bizzarro.replit.app/stride-calculator",
    provider: {
      "@type": "Organization",
      name: "Dan Bizzarro Method"
    },
    audience: {
      "@type": "Audience",
      audienceType: "Equestrians, Horse Trainers, Course Designers"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <SEOHead 
        title="Stride Calculator - Professional Equestrian Distance Tool | Dan Bizzarro Method"
        description="Calculate precise stride distances for horse training. Professional tool for poles, jumps, and course design with measurements in yards and meters."
        keywords="stride calculator, horse training, equestrian distances, pole distances, jump distances, course design, eventing calculator"
        canonical="https://dan-bizzarro.replit.app/stride-calculator"
      />
      <StructuredData type="Service" data={strideCalculatorStructuredData} />
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 h-10 text-base">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-2 md:mb-4">
              Stride Distance Calculator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
              Calculate precise distances for poles and jumps based on your height. 
              Get measurements in both yards and meters, plus your personal step count.
            </p>
          </div>
        </div>

        <div className="grid gap-6 max-w-6xl mx-auto lg:grid-cols-2 lg:gap-8">
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
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <Label htmlFor="user-height" className="text-base font-medium">Your Height</Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUserFeet(Math.max(4, userFeet - 1))}
                        disabled={userFeet <= 4}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        id="user-feet"
                        type="number"
                        inputMode="numeric"
                        value={userFeet || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setUserFeet(0);
                          } else {
                            const num = parseInt(value, 10);
                            if (!isNaN(num)) {
                              setUserFeet(Math.max(4, Math.min(7, num)));
                            }
                          }
                        }}
                        onWheel={(e) => {
                          e.preventDefault();
                          const delta = e.deltaY > 0 ? -1 : 1;
                          const newValue = Math.max(4, Math.min(7, userFeet + delta));
                          setUserFeet(newValue);
                        }}
                        placeholder="5"
                        min="4"
                        max="7"
                        step="1"
                        className="h-12 text-lg text-center flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUserFeet(Math.min(7, userFeet + 1))}
                        disabled={userFeet >= 7}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">Feet</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUserInches(Math.max(0, userInches - 1))}
                        disabled={userInches <= 0}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        id="user-inches"
                        type="number"
                        inputMode="numeric"
                        value={userInches || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setUserInches(0);
                          } else {
                            const num = parseInt(value, 10);
                            if (!isNaN(num)) {
                              setUserInches(Math.max(0, Math.min(11, num)));
                            }
                          }
                        }}
                        onWheel={(e) => {
                          e.preventDefault();
                          const delta = e.deltaY > 0 ? -1 : 1;
                          const newValue = Math.max(0, Math.min(11, userInches + delta));
                          setUserInches(newValue);
                        }}
                        placeholder="8"
                        min="0"
                        max="11"
                        step="1"
                        className="h-12 text-lg text-center flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUserInches(Math.min(11, userInches + 1))}
                        disabled={userInches >= 11}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">Inches</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Used to calculate your personal step count
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="horse-height" className="text-base font-medium">Horse Height</Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setHorseHands(Math.max(10, horseHands - 1))}
                        disabled={horseHands <= 10}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        id="horse-hands"
                        type="number"
                        inputMode="numeric"
                        value={horseHands || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setHorseHands(0);
                          } else {
                            const num = parseInt(value, 10);
                            if (!isNaN(num)) {
                              setHorseHands(Math.max(10, Math.min(18, num)));
                            }
                          }
                        }}
                        onWheel={(e) => {
                          e.preventDefault();
                          const delta = e.deltaY > 0 ? -1 : 1;
                          const newValue = Math.max(10, Math.min(18, horseHands + delta));
                          setHorseHands(newValue);
                        }}
                        placeholder="16"
                        min="10"
                        max="18"
                        step="1"
                        className="h-12 text-lg text-center flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setHorseHands(Math.min(18, horseHands + 1))}
                        disabled={horseHands >= 18}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">Hands</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setHorseInches(Math.max(0, horseInches - 1))}
                        disabled={horseInches <= 0}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        id="horse-inches"
                        type="number"
                        inputMode="numeric"
                        value={horseInches || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setHorseInches(0);
                          } else {
                            const num = parseInt(value, 10);
                            if (!isNaN(num)) {
                              setHorseInches(Math.max(0, Math.min(3, num)));
                            }
                          }
                        }}
                        onWheel={(e) => {
                          e.preventDefault();
                          const delta = e.deltaY > 0 ? -1 : 1;
                          const newValue = Math.max(0, Math.min(3, horseInches + delta));
                          setHorseInches(newValue);
                        }}
                        placeholder="0"
                        min="0"
                        max="3"
                        step="1"
                        className="h-12 text-lg text-center flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setHorseInches(Math.min(3, horseInches + 1))}
                        disabled={horseInches >= 3}
                        className="h-12 w-12 flex-shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">Inches</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Enter your horse's exact height for accurate pole spacing
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Exercise Type</Label>
                <Select value={distanceType} onValueChange={(value: DistanceType) => setDistanceType(value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-poles" className="py-3 text-base">Walk Poles</SelectItem>
                    <SelectItem value="trot-poles" className="py-3 text-base">Trot Poles</SelectItem>
                    <SelectItem value="canter-poles" className="py-3 text-base">Canter Poles</SelectItem>
                    <SelectItem value="gridwork" className="py-3 text-base">Gridwork Exercises</SelectItem>
                    <SelectItem value="course-distances" className="py-3 text-base">Course Distances</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {needsStrideSelection() && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Number of Strides</Label>
                  <Select value={strideCount} onValueChange={(value: StrideCount) => setStrideCount(value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-stride" className="py-3 text-base">1 Stride</SelectItem>
                      <SelectItem value="2-stride" className="py-3 text-base">2 Strides</SelectItem>
                      <SelectItem value="3-stride" className="py-3 text-base">3 Strides</SelectItem>
                      <SelectItem value="4-stride" className="py-3 text-base">4 Strides</SelectItem>
                      {(distanceType === "gridwork" || distanceType === "course-distances") && (
                        <>
                          <SelectItem value="5-stride" className="py-3 text-base">5 Strides</SelectItem>
                          <SelectItem value="6-stride" className="py-3 text-base">6 Strides</SelectItem>
                          {distanceType === "course-distances" && (
                            <SelectItem value="7-stride" className="py-3 text-base">7 Strides</SelectItem>
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                <Button onClick={calculateDistances} className="flex-1 h-12 text-base font-medium">
                  Calculate Selected
                </Button>
                <Button onClick={calculateAllDistances} variant="outline" className="flex-1 h-12 text-base font-medium">
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-3xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {result.distanceMeters}m
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Meters</div>
                          </div>
                          
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-3xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                              {result.distanceYards}yd
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Yards</div>
                          </div>
                          
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl sm:text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-2">
                              <Users className="h-6 w-6 sm:h-5 sm:w-5" />
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

        {/* Safety Notes Section */}
        <div className="mt-6 sm:mt-8">
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">Safety Guidelines</span>
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300 font-medium">
                Essential safety practices for all training exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Safety Equipment:</strong> Always wear approved helmets and body protectors
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Progressive Training:</strong> Start low and gradually increase difficulty
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Equipment Check:</strong> Ensure all poles and jumps are secure
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Qualified Supervision:</strong> Have an instructor present for new exercises
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Arena Conditions:</strong> Check footing and surface suitability
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Proper Warm-up:</strong> Allow adequate preparation time
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      These calculations provide guidance based on the Dan Bizzarro Method. Always adapt distances 
                      to your horse's individual stride, ability level, and training progression. Safety must always 
                      be the top priority in all training activities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Diagrams Section */}
        <div className="mt-6 sm:mt-8">
          <ExerciseDiagram />
        </div>

      </div>
    </div>
  );
}