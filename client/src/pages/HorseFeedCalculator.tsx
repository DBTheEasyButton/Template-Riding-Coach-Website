import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Scale, Zap, ArrowLeft, Info, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface FeedRequirements {
  dailyHay: number;
  dailyHard: number;
  dailyTotal: number;
  weeklyHay: number;
  weeklyHard: number;
  monthlyHay: number;
  monthlyHard: number;
  monthlyCost: number;
  recommendations: string[];
  waterRequirement: number;
}

export default function HorseFeedCalculator() {
  const [horseWeight, setHorseWeight] = useState<number>(500);
  const [workLevel, setWorkLevel] = useState<string>("moderate");
  const [condition, setCondition] = useState<string>("good");
  const [age, setAge] = useState<string>("adult");
  const [hayPrice, setHayPrice] = useState<number>(12);
  const [hardFeedPrice, setHardFeedPrice] = useState<number>(18);
  const [results, setResults] = useState<FeedRequirements | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const calculateFeed = () => {
    // Base requirement: 2-2.5% of body weight in dry matter
    let baseRequirement = horseWeight * 0.022; // kg per day

    // Adjust for work level
    const workMultipliers = {
      "light": 1.0,
      "moderate": 1.15,
      "heavy": 1.3,
      "very-heavy": 1.5
    };
    const workMultiplier = workMultipliers[workLevel as keyof typeof workMultipliers] || 1.0;

    // Adjust for body condition
    const conditionMultipliers = {
      "poor": 1.2,
      "thin": 1.1,
      "good": 1.0,
      "fat": 0.9
    };
    const conditionMultiplier = conditionMultipliers[condition as keyof typeof conditionMultipliers] || 1.0;

    // Adjust for age
    const ageMultipliers = {
      "young": 1.15, // Growing horses
      "adult": 1.0,
      "senior": 1.1 // May need easier to digest feed
    };
    const ageMultiplier = ageMultipliers[age as keyof typeof ageMultipliers] || 1.0;

    const totalRequirement = baseRequirement * workMultiplier * conditionMultiplier * ageMultiplier;

    // Split between hay (forage) and hard feed
    // General rule: minimum 1.5% body weight in forage
    const minForage = horseWeight * 0.015;
    
    let forageRatio = 0.8; // 80% forage for light work
    if (workLevel === "moderate") forageRatio = 0.75;
    else if (workLevel === "heavy") forageRatio = 0.7;
    else if (workLevel === "very-heavy") forageRatio = 0.65;

    const dailyHay = Math.max(minForage, totalRequirement * forageRatio);
    const dailyHard = totalRequirement - dailyHay;

    // Calculate costs
    const weeklyHay = dailyHay * 7;
    const weeklyHard = dailyHard * 7;
    const monthlyHay = dailyHay * 30;
    const monthlyHard = dailyHard * 30;

    // Assuming hay is sold by weight and hard feed by weight
    const monthlyCost = (monthlyHay * hayPrice) + (monthlyHard * hardFeedPrice);

    // Water requirement (litres per day)
    const waterRequirement = Math.round((horseWeight * 0.05) + (dailyHard * 3));

    // Generate recommendations
    const recommendations = [];
    
    if (dailyHard > horseWeight * 0.005) {
      recommendations.push("Consider splitting hard feed into multiple smaller meals");
    }
    if (dailyHay < horseWeight * 0.015) {
      recommendations.push("Increase forage to maintain gut health");
    }
    if (workLevel === "very-heavy") {
      recommendations.push("High energy work may require specialized competition feeds");
    }
    if (age === "senior") {
      recommendations.push("Consider senior-specific feeds that are easier to digest");
    }
    if (condition === "poor" || condition === "thin") {
      recommendations.push("Monitor weight gain and adjust feed accordingly");
    }
    if (condition === "fat") {
      recommendations.push("Focus on low-energy, high-fibre feeds and increase exercise");
    }

    setResults({
      dailyHay: Math.round(dailyHay * 10) / 10,
      dailyHard: Math.round(dailyHard * 10) / 10,
      dailyTotal: Math.round(totalRequirement * 10) / 10,
      weeklyHay: Math.round(weeklyHay * 10) / 10,
      weeklyHard: Math.round(weeklyHard * 10) / 10,
      monthlyHay: Math.round(monthlyHay),
      monthlyHard: Math.round(monthlyHard),
      monthlyCost: Math.round(monthlyCost),
      recommendations,
      waterRequirement
    });
  };

  const getWorkDescription = (level: string) => {
    const descriptions = {
      "light": "Light hacking, occasional schooling",
      "moderate": "Regular schooling, local competitions",
      "heavy": "Intensive training, regular competitions", 
      "very-heavy": "Elite level training, frequent competitions"
    };
    return descriptions[level as keyof typeof descriptions] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-playfair font-bold text-navy mb-6">Horse Feed Calculator</h1>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate daily feed requirements and monthly costs based on your horse's weight, work level, and condition
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-2 shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Horse Details
              </CardTitle>
              <CardDescription className="text-green-100">
                Enter your horse's information for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="horse-weight">Horse Weight (kg)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setHorseWeight(Math.max(200, horseWeight - 25))}
                    disabled={horseWeight <= 200}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input
                    id="horse-weight"
                    type="number"
                    value={horseWeight}
                    onChange={(e) => setHorseWeight(Math.max(200, Math.min(1000, parseInt(e.target.value) || 200)))}
                    min="200"
                    max="1000"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setHorseWeight(Math.min(1000, horseWeight + 25))}
                    disabled={horseWeight >= 1000}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Typical range: 400-600kg for riding horses</p>
              </div>

              <div>
                <Label htmlFor="work-level">Work Level</Label>
                <Select value={workLevel} onValueChange={setWorkLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Work</SelectItem>
                    <SelectItem value="moderate">Moderate Work</SelectItem>
                    <SelectItem value="heavy">Heavy Work</SelectItem>
                    <SelectItem value="very-heavy">Very Heavy Work</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">{getWorkDescription(workLevel)}</p>
              </div>

              <div>
                <Label htmlFor="condition">Body Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor (Score 1-2)</SelectItem>
                    <SelectItem value="thin">Thin (Score 3-4)</SelectItem>
                    <SelectItem value="good">Good (Score 5-6)</SelectItem>
                    <SelectItem value="fat">Fat (Score 7-9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age">Age Category</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="young">Young (Under 5 years)</SelectItem>
                    <SelectItem value="adult">Adult (5-15 years)</SelectItem>
                    <SelectItem value="senior">Senior (Over 15 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-navy">Feed Prices (per kg)</h4>
                
                <div>
                  <Label htmlFor="hay-price">Hay/Haylage Price (£)</Label>
                  <Input
                    id="hay-price"
                    type="number"
                    value={hayPrice}
                    onChange={(e) => setHayPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    min="0"
                    step="0.5"
                    className="text-center"
                  />
                </div>

                <div>
                  <Label htmlFor="hard-feed-price">Hard Feed Price (£)</Label>
                  <Input
                    id="hard-feed-price"
                    type="number"
                    value={hardFeedPrice}
                    onChange={(e) => setHardFeedPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    min="0"
                    step="0.5"
                    className="text-center"
                  />
                </div>
              </div>

              <Button onClick={calculateFeed} className="w-full bg-orange hover:bg-orange/90">
                Calculate Feed Requirements
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {results && (
              <>
                <Card className="shadow-lg border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white">
                    <CardTitle className="flex items-center">
                      <Scale className="w-5 h-5 mr-2" />
                      Daily Feed Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Hay/Forage</p>
                        <p className="text-2xl font-bold text-green-600">{results.dailyHay}kg</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Hard Feed</p>
                        <p className="text-2xl font-bold text-blue-600">{results.dailyHard}kg</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Total Feed</p>
                        <p className="text-2xl font-bold text-purple-600">{results.dailyTotal}kg</p>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Daily Water Requirement</p>
                      <p className="text-xl font-bold text-indigo-600">{results.waterRequirement} litres</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Weekly & Monthly Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-navy mb-3">Weekly</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Hay/Forage:</span>
                            <span className="font-medium">{results.weeklyHay}kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hard Feed:</span>
                            <span className="font-medium">{results.weeklyHard}kg</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-navy mb-3">Monthly</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Hay/Forage:</span>
                            <span className="font-medium">{results.monthlyHay}kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hard Feed:</span>
                            <span className="font-medium">{results.monthlyHard}kg</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-bold text-orange">
                            <span>Total Cost:</span>
                            <span>£{results.monthlyCost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {results.recommendations.length > 0 && (
                  <Card className="shadow-lg border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        Feeding Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {results.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-800">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle>Important Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• These calculations are estimates based on general guidelines</p>
                      <p>• Individual horses may have different requirements</p>
                      <p>• Consult with an equine nutritionist for specific dietary needs</p>
                      <p>• Always introduce feed changes gradually over 7-14 days</p>
                      <p>• Monitor body condition and adjust as needed</p>
                      <p>• Ensure access to fresh, clean water at all times</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}