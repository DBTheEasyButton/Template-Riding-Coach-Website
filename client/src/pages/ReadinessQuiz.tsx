import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

const levels = [
  { value: "BE80", label: "BE80" },
  { value: "BE90", label: "BE90" },
  { value: "BE100", label: "BE100" },
  { value: "Novice", label: "Novice or higher" }
];

const questions: QuizQuestion[] = [
  {
    id: "fitness",
    question: "How do you work on your horse's fitness?",
    options: [
      { value: "uphill", label: "Uphill canter work weekly", score: 4 },
      { value: "flat", label: "Flat field canter work weekly", score: 3 },
      { value: "already_fit", label: "No specific canter work; horse is already fit", score: 2 },
      { value: "no_canter", label: "No canter work at all", score: 1 }
    ]
  },
  {
    id: "jumping",
    question: "Can you jump a clear round at your target height in training?",
    options: [
      { value: "rails_stops", label: "Often have rails down or stops", score: 1 },
      { value: "sometimes", label: "Sometimes clear, but not consistent", score: 2 },
      { value: "usually", label: "Usually clear without stops", score: 3 },
      { value: "confident", label: "Confidently clear every time", score: 4 }
    ]
  },
  {
    id: "cross_country",
    question: "Has your horse jumped cross-country in the last month?",
    options: [
      { value: "confident", label: "Yes, confidently over all fences", score: 4 },
      { value: "spooking", label: "Yes, but spooking or stopping at several fences", score: 2 },
      { value: "green", label: "Yes, but horse felt green and unsure", score: 2 },
      { value: "no_recent", label: "No, no recent cross-country jumping", score: 1 }
    ]
  },
  {
    id: "rider_confidence",
    question: "How do you feel about riding at this level?",
    options: [
      { value: "nervous", label: "Nervous and not ready", score: 1 },
      { value: "close", label: "Close but not fully confident", score: 2 },
      { value: "cautious", label: "Confident but cautious", score: 3 },
      { value: "ready", label: "Totally ready and excited", score: 4 }
    ]
  },
  {
    id: "dressage",
    question: "Can you ride a dressage test for this level without major issues?",
    options: [
      { value: "not_yet", label: "Not yet", score: 1 },
      { value: "mostly", label: "Mostly", score: 2 },
      { value: "yes_basic", label: "Yes, but not competitively", score: 3 },
      { value: "competitive", label: "Yes, and aiming to score well", score: 4 }
    ]
  }
];

export default function ReadinessQuiz() {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'level' | 'questions' | 'results'>('level');
  const [showResults, setShowResults] = useState(false);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setCurrentStep('questions');
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      }
    });
    return totalScore;
  };

  const getResults = () => {
    const score = calculateScore();
    const maxScore = questions.length * 4;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        level: "Highly Ready",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message: `Excellent! You and your horse appear well-prepared for ${selectedLevel}. You're demonstrating consistent training, confidence, and experience across all areas.`,
        recommendations: [
          "Continue your current training routine",
          "Consider entering a competition at this level",
          "Focus on fine-tuning for competitive performance",
          "Maintain regular fitness and jumping work"
        ]
      };
    } else if (percentage >= 60) {
      return {
        level: "Almost Ready",
        icon: Target,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        message: `You're close to being ready for ${selectedLevel}! There are a few areas that could use some additional preparation.`,
        recommendations: [
          "Focus on consistency in training sessions",
          "Increase cross-country exposure if needed",
          "Work on building confidence in weaker areas",
          "Consider a schooling competition first",
          "Continue fitness work with your horse"
        ]
      };
    } else {
      return {
        level: "Needs More Preparation",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: `Take your time building up to ${selectedLevel}. More preparation will help ensure a positive and safe experience for both you and your horse.`,
        recommendations: [
          "Establish a regular fitness routine for your horse",
          "Practice jumping at current level consistently",
          "Get more cross-country experience",
          "Work with an instructor to build confidence",
          "Master dressage movements for your current level",
          "Consider starting at a lower level first"
        ]
      };
    }
  };

  const handleShowResults = () => {
    setCurrentStep('results');
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedLevel("");
    setAnswers({});
    setCurrentStep('level');
    setShowResults(false);
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id]);
  const progress = (Object.keys(answers).length / questions.length) * 100;

  if (currentStep === 'level') {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-playfair font-bold text-navy mb-4">
                Eventing Readiness Quiz
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Assess your preparation for your target eventing level with personalized feedback and recommendations.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Step 1: Select Your Target Level</CardTitle>
                <CardDescription className="text-center">
                  Choose the eventing level you're preparing for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {levels.map(level => (
                    <Button
                      key={level.value}
                      variant="outline"
                      size="lg"
                      className="h-16 text-lg hover:bg-green-50 hover:border-green-300"
                      onClick={() => handleLevelSelect(level.value)}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'questions') {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-playfair font-bold text-navy mb-2">
                Readiness Assessment for {selectedLevel}
              </h1>
              <Progress value={progress} className="max-w-md mx-auto" />
              <p className="text-sm text-gray-500 mt-2">
                {Object.keys(answers).length} of {questions.length} questions completed
              </p>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {index < 3 ? "Horse Questions" : "Rider Questions"} - Question {index + 1}
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                      {question.question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options.map(option => (
                        <div key={option.value} className="flex items-center space-x-2 py-2">
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label 
                            htmlFor={`${question.id}-${option.value}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep('level')}>
                  Change Level
                </Button>
                <Button 
                  onClick={handleShowResults}
                  disabled={!allQuestionsAnswered}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Get My Results
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const results = getResults();
  const ResultIcon = results.icon;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className={`${results.bgColor} ${results.borderColor} border-2`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <ResultIcon className={`w-16 h-16 ${results.color}`} />
              </div>
              <CardTitle className={`text-3xl ${results.color}`}>
                {results.level}
              </CardTitle>
              <CardDescription className="text-lg">
                Assessment Results for {selectedLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 text-center">
                {results.message}
              </p>

              <div>
                <h3 className="text-xl font-semibold text-navy mb-4">Recommendations:</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full ${results.color.replace('text-', 'bg-')} mt-2 mr-3 flex-shrink-0`}></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center space-x-4 pt-6">
                <Button variant="outline" onClick={resetQuiz}>
                  Take Quiz Again
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = "/#clinics"}
                >
                  Book Training Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}