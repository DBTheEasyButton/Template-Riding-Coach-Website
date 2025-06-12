import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Ruler, Users, Info } from "lucide-react";

type DistanceType = "poles" | "gymnastics" | "related";
type StrideCount = "bounce" | "1-stride" | "2-stride" | "3-stride" | "4-stride";

interface StrideCalculation {
  distanceYards: number;
  distanceMeters: number;
  userSteps: number;
  description: string;
  notes: string;
}

export default function StrideCalculator() {
  const [userHeight, setUserHeight] = useState<number>(170);
  const [distanceType, setDistanceType] = useState<DistanceType>("gymnastics");
  const [strideCount, setStrideCount] = useState<StrideCount>("1-stride");
  const [results, setResults] = useState<StrideCalculation[]>([]);

  // Standard distances in meters
  const standardDistances = {
    poles: {
      "bounce": { distance: 2.7, description: "Bounce poles (trotting)" },
      "1-stride": { distance: 4.3, description: "One trot stride between poles" },
      "2-stride": { distance: 6.0, description: "Two trot strides between poles" },
      "3-stride": { distance: 7.6, description: "Three trot strides between poles" },
      "4-stride": { distance: 9.1, description: "Four trot strides between poles" }
    },
    gymnastics: {
      "bounce": { distance: 3.6, description: "Bounce jump (no stride)" },
      "1-stride": { distance: 7.0, description: "One canter stride between jumps" },
      "2-stride": { distance: 10.4, description: "Two canter strides between jumps" },
      "3-stride": { distance: 13.7, description: "Three canter strides between jumps" },
      "4-stride": { distance: 17.1, description: "Four canter strides between jumps" }
    },
    related: {
      "1-stride": { distance: 24.0, description: "One galloping stride (course)" },
      "2-stride": { distance: 35.0, description: "Two galloping strides (course)" },
      "3-stride": { distance: 46.0, description: "Three galloping strides (course)" },
      "4-stride": { distance: 57.0, description: "Four galloping strides (course)" },
      "bounce": { distance: 24.0, description: "Related distance (short)" }
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

  const calculateDistances = () => {
    const calculations: StrideCalculation[] = [];
    const distances = standardDistances[distanceType];

    if (strideCount === "bounce" && distanceType === "related") {
      // For related distances, "bounce" doesn't make sense, so skip
      return;
    }

    Object.entries(distances).forEach(([stride, data]) => {
      if (stride === strideCount || strideCount === "bounce") {
        const distanceMeters = data.distance;
        const distanceYards = metersToYards(distanceMeters);
        const userSteps = calculateUserSteps(userHeight, distanceMeters);
        
        let notes = "";
        if (distanceType === "poles") {
          notes = "Measured from center of pole to center of pole. Horse should trot through calmly.";
        } else if (distanceType === "gymnastics") {
          notes = "Measured from back of first jump to front of second jump. Adjust for jump height.";
        } else if (distanceType === "related") {
          notes = "Measured from back of first jump to front of second jump. Course-related distances.";
        }

        calculations.push({
          distanceYards,
          distanceMeters,
          userSteps,
          description: data.description,
          notes
        });
      }
    });

    setResults(calculations);
  };

  const calculateAllDistances = () => {
    const allCalculations: StrideCalculation[] = [];
    const distances = standardDistances[distanceType];

    Object.entries(distances).forEach(([stride, data]) => {
      const distanceMeters = data.distance;
      const distanceYards = metersToYards(distanceMeters);
      const userSteps = calculateUserSteps(userHeight, distanceMeters);
      
      let notes = "";
      if (distanceType === "poles") {
        notes = "Measured from center of pole to center of pole.";
      } else if (distanceType === "gymnastics") {
        notes = "Measured from back of first jump to front of second jump.";
      } else if (distanceType === "related") {
        notes = "Measured from back of first jump to front of second jump.";
      }

      allCalculations.push({
        distanceYards,
        distanceMeters,
        userSteps,
        description: data.description,
        notes
      });
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
                <Label>Distance Type</Label>
                <Select value={distanceType} onValueChange={(value: DistanceType) => setDistanceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poles">Trotting Poles</SelectItem>
                    <SelectItem value="gymnastics">Jumping Gymnastics</SelectItem>
                    <SelectItem value="related">Course Related Distances</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Strides</Label>
                <Select value={strideCount} onValueChange={(value: StrideCount) => setStrideCount(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {distanceType !== "related" && <SelectItem value="bounce">Bounce (No Stride)</SelectItem>}
                    <SelectItem value="1-stride">1 Stride</SelectItem>
                    <SelectItem value="2-stride">2 Strides</SelectItem>
                    <SelectItem value="3-stride">3 Strides</SelectItem>
                    <SelectItem value="4-stride">4 Strides</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Trotting Poles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Measured from center to center. Start with longer distances for green horses. 
                  Adjust based on your horse's natural stride length.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">Jumping Gymnastics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Measured from back rail to front rail. Add 15cm for every 30cm increase in jump height. 
                  Start lower and build up gradually.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Course Distances</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard competition distances. Vary by 1-2 meters depending on ground conditions, 
                  jump height, and horse's natural stride.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                <strong>Safety First:</strong> Always start with poles on the ground and build up gradually. 
                These are standard distances - adjust for your individual horse's stride length and ability level.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}