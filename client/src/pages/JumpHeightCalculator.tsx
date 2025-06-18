import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Target, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface ProgressionResult {
  currentHeight: number;
  nextHeight: number;
  weeklyIncrease: number;
  timeToGoal: number;
  safetyNotes: string[];
  recommended: boolean;
}

export default function JumpHeightCalculator() {
  const [horseAge, setHorseAge] = useState<number>(8);
  const [currentHeight, setCurrentHeight] = useState<number>(80);
  const [goalHeight, setGoalHeight] = useState<number>(110);
  const [experienceLevel, setExperienceLevel] = useState<string>("intermediate");
  const [discipline, setDiscipline] = useState<string>("showjumping");
  const [trainingFrequency, setTrainingFrequency] = useState<number>(3);
  const [results, setResults] = useState<ProgressionResult | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const calculateProgression = () => {
    const ageFactor = horseAge < 6 ? 0.7 : horseAge > 15 ? 0.8 : 1.0;
    const experienceFactor = {
      "beginner": 0.6,
      "intermediate": 0.8,
      "advanced": 1.0,
      "professional": 1.2
    }[experienceLevel] || 0.8;

    const frequencyFactor = trainingFrequency >= 4 ? 1.0 : trainingFrequency >= 2 ? 0.8 : 0.6;
    
    // Base weekly increase (cm)
    let baseIncrease = 5;
    if (currentHeight < 60) baseIncrease = 10;
    else if (currentHeight < 90) baseIncrease = 7;
    else if (currentHeight > 120) baseIncrease = 3;

    const weeklyIncrease = Math.round(baseIncrease * ageFactor * experienceFactor * frequencyFactor);
    const heightDifference = goalHeight - currentHeight;
    const weeksToGoal = Math.ceil(heightDifference / weeklyIncrease);
    
    const nextHeight = Math.min(currentHeight + weeklyIncrease, goalHeight);
    
    const safetyNotes = [];
    let recommended = true;

    if (horseAge < 5) {
      safetyNotes.push("Young horses should progress very slowly to protect developing joints");
      recommended = false;
    }
    if (horseAge > 18) {
      safetyNotes.push("Older horses may need more recovery time between increases");
    }
    if (heightDifference > 40) {
      safetyNotes.push("Large height increases should be spread over several months");
    }
    if (trainingFrequency < 2) {
      safetyNotes.push("Insufficient training frequency for safe progression");
      recommended = false;
    }
    if (weeklyIncrease > 10) {
      safetyNotes.push("Progression rate may be too aggressive - consider slower increases");
      recommended = false;
    }

    setResults({
      currentHeight,
      nextHeight,
      weeklyIncrease,
      timeToGoal: weeksToGoal,
      safetyNotes,
      recommended
    });
  };

  const getHeightDescription = (height: number) => {
    if (height <= 60) return "Ground poles / Cross poles";
    if (height <= 80) return "Beginner / Confidence building";
    if (height <= 100) return "Intermediate / Local competitions";
    if (height <= 120) return "Advanced / Regional competitions";
    if (height <= 140) return "Elite / National level";
    return "International / Grand Prix level";
  };

  const getDisciplineHeights = () => {
    const heights = {
      "showjumping": [
        { height: 60, label: "60cm - Beginner" },
        { height: 70, label: "70cm - Novice" },
        { height: 80, label: "80cm - Elementary" },
        { height: 90, label: "90cm - Intermediate" },
        { height: 100, label: "1.0m - Advanced" },
        { height: 110, label: "1.1m - Expert" },
        { height: 120, label: "1.2m - Regional" },
        { height: 130, label: "1.3m - National" },
        { height: 140, label: "1.4m - International" },
        { height: 150, label: "1.5m - Grand Prix" }
      ],
      "eventing": [
        { height: 70, label: "70cm - BE80" },
        { height: 80, label: "80cm - BE90" },
        { height: 90, label: "90cm - BE100" },
        { height: 100, label: "1.0m - Novice" },
        { height: 110, label: "1.1m - Intermediate" },
        { height: 120, label: "1.2m - Advanced" },
        { height: 125, label: "1.25m - CCI3*" },
        { height: 130, label: "1.3m - CCI4*" },
        { height: 135, label: "1.35m - CCI5*" }
      ]
    };
    return heights[discipline as keyof typeof heights] || heights.showjumping;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
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
          <h1 className="text-5xl font-playfair font-bold text-navy mb-6">Jump Height Progression Calculator</h1>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Plan safe and effective height progression for your horse based on age, experience, and training frequency
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-2 shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Horse & Training Details
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter your horse's information and training schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="horse-age">Horse Age (years)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setHorseAge(Math.max(3, horseAge - 1))}
                    disabled={horseAge <= 3}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input
                    id="horse-age"
                    type="number"
                    value={horseAge}
                    onChange={(e) => setHorseAge(Math.max(3, Math.min(25, parseInt(e.target.value) || 3)))}
                    min="3"
                    max="25"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setHorseAge(Math.min(25, horseAge + 1))}
                    disabled={horseAge >= 25}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="current-height">Current Jumping Height (cm)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentHeight(Math.max(40, currentHeight - 10))}
                    disabled={currentHeight <= 40}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input
                    id="current-height"
                    type="number"
                    value={currentHeight}
                    onChange={(e) => setCurrentHeight(Math.max(40, Math.min(180, parseInt(e.target.value) || 40)))}
                    min="40"
                    max="180"
                    step="10"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentHeight(Math.min(180, currentHeight + 10))}
                    disabled={currentHeight >= 180}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{getHeightDescription(currentHeight)}</p>
              </div>

              <div>
                <Label htmlFor="goal-height">Goal Height (cm)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGoalHeight(Math.max(currentHeight, goalHeight - 10))}
                    disabled={goalHeight <= currentHeight}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input
                    id="goal-height"
                    type="number"
                    value={goalHeight}
                    onChange={(e) => setGoalHeight(Math.max(currentHeight, Math.min(180, parseInt(e.target.value) || currentHeight)))}
                    min={currentHeight}
                    max="180"
                    step="10"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGoalHeight(Math.min(180, goalHeight + 10))}
                    disabled={goalHeight >= 180}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{getHeightDescription(goalHeight)}</p>
              </div>

              <div>
                <Label htmlFor="discipline">Discipline</Label>
                <Select value={discipline} onValueChange={setDiscipline}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="showjumping">Show Jumping</SelectItem>
                    <SelectItem value="eventing">Eventing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="training-frequency">Training Sessions per Week</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTrainingFrequency(Math.max(1, trainingFrequency - 1))}
                    disabled={trainingFrequency <= 1}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input
                    id="training-frequency"
                    type="number"
                    value={trainingFrequency}
                    onChange={(e) => setTrainingFrequency(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="7"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTrainingFrequency(Math.min(7, trainingFrequency + 1))}
                    disabled={trainingFrequency >= 7}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button onClick={calculateProgression} className="w-full bg-orange hover:bg-orange/90">
                Calculate Progression Plan
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {results && (
              <Card className="shadow-lg border-gray-200">
                <CardHeader className={`text-white ${results.recommended ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-700'}`}>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Progression Plan
                    {results.recommended ? (
                      <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">Recommended</Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-auto bg-red-100 text-red-800">Caution</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Next Training Height</p>
                      <p className="text-3xl font-bold text-blue-600">{results.nextHeight}cm</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Weekly Increase</p>
                      <p className="text-3xl font-bold text-indigo-600">{results.weeklyIncrease}cm</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 mb-2">Estimated Time to Goal</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {results.timeToGoal} weeks ({Math.ceil(results.timeToGoal / 4)} months)
                    </p>
                  </div>

                  {results.safetyNotes.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <h4 className="font-semibold text-yellow-800">Safety Considerations</h4>
                      </div>
                      <ul className="space-y-2">
                        {results.safetyNotes.map((note, index) => (
                          <li key={index} className="text-sm text-yellow-700 flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {discipline === "showjumping" ? "Show Jumping" : "Eventing"} Height Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {getDisciplineHeights().map((level) => (
                    <div
                      key={level.height}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        level.height === currentHeight
                          ? 'bg-blue-50 border-blue-200'
                          : level.height === goalHeight
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{level.label}</span>
                      {level.height === currentHeight && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">Current</Badge>
                      )}
                      {level.height === goalHeight && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">Goal</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}