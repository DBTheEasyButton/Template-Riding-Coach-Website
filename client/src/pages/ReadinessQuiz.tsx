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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setCurrentStep('questions');
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // All questions answered, show results
        setCurrentStep('results');
        setShowResults(true);
      }
    }, 500);
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

    // Check specific answers for personalized advice
    const fitnessAnswer = answers['fitness'];
    const crossCountryAnswer = answers['cross_country'];
    const jumpingAnswer = answers['jumping'];
    const confidenceAnswer = answers['rider_confidence'];

    const generatePersonalizedAdvice = (level: string) => {
      let advice = [];
      let hasIncludedFitnessTest = false;

      // Fitness-specific advice
      if (fitnessAnswer === 'no_canter') {
        advice.push("Starting a fitness routine is crucial - try introducing canter work gradually. Begin with short sessions and build up slowly. Your horse needs to be fit enough to canter for the duration of your cross-country course without getting tired.");
      } else if (fitnessAnswer === 'already_fit') {
        advice.push("It's great that your horse is fit! Try cantering for the same amount of time your cross-country course will take and see how both you and your horse feel afterward. This will give you a realistic idea of your actual fitness level.");
        hasIncludedFitnessTest = true;
      } else if (fitnessAnswer === 'flat') {
        advice.push("Flat canter work is a good start! If possible, try to incorporate some uphill work as it really builds strength and stamina. Test yourself by cantering for the full duration of your target course time to check your fitness level.");
        hasIncludedFitnessTest = true;
      }

      // Show jumping specific advice
      if (jumpingAnswer === 'rails_stops') {
        advice.push("Show jumping needs significant improvement. Focus on gymnastics and grids to build your horse's confidence and technique. Start with simple pole work, then progress to small jumps. Practice at home until you can consistently jump clear rounds before considering competition.");
      } else if (jumpingAnswer === 'sometimes') {
        advice.push("Your show jumping consistency needs work. Try setting up simple courses at home and practice riding the same track repeatedly until both you and your horse can navigate it smoothly every time. Focus on rhythm and straightness between fences.");
      }

      // Dressage specific advice
      const dressageAnswer = answers['dressage'];
      if (dressageAnswer === 'not_yet') {
        advice.push("Dressage fundamentals need attention before competing. Work on basic movements like accurate circles, transitions, and straightness. Consider lessons with a dressage instructor to establish proper basics. You need to be comfortable with all required movements for your level.");
      } else if (dressageAnswer === 'mostly') {
        advice.push("Polish your dressage work by practicing the specific test movements regularly. Focus on accuracy, rhythm, and smooth transitions. Record yourself riding the test to identify areas needing improvement.");
      }

      // Cross-country confidence advice
      if (crossCountryAnswer !== 'confident') {
        advice.push("Cross-country confidence is absolutely essential! Keep practicing different types of fences until both you and your horse feel completely comfortable with every variety. Remember, everything becomes more challenging at a competition, so you want to feel rock-solid at home first. Consider working with a coach to build this confidence systematically.");
      }

      // General encouragement and practical tips
      if (level === "Highly Ready") {
        advice.push("You're doing brilliantly! Keep up your current routine and maybe add some competition simulation exercises - practice under pressure, with time constraints, or in different environments to prepare for competition day nerves.");
      } else if (level === "Almost Ready") {
        advice.push("You're so close! Focus on consistency in your training. Maybe try a schooling competition or hunter trial to get a feel for the competition environment without the pressure.");
      } else {
        advice.push("Don't worry - every successful rider has been where you are now! Take your time building up each element. Consider starting at a slightly lower level to build confidence, then work your way up.");
      }

      // Only include fitness test if not already mentioned above
      if (!hasIncludedFitnessTest) {
        if (crossCountryAnswer === 'confident' && fitnessAnswer === 'uphill') {
          advice.push("Since you're feeling confident, do a final fitness check: canter your horse for the duration of your target cross-country course time and see how you both feel. This is the best way to know if you're truly ready!");
        } else {
          advice.push("Here's a great test: try cantering your horse for the same amount of time your cross-country course will take. If you or your horse feel tired or stressed, you'll know exactly what to work on!");
        }
      }

      return advice;
    };

    if (percentage >= 80) {
      return {
        level: "Highly Ready",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message: `Fantastic! You and your horse are looking really well-prepared for ${selectedLevel}. You're showing great consistency in training and confidence across all areas - that's exactly what you need for a successful competition.`,
        recommendations: generatePersonalizedAdvice("Highly Ready")
      };
    } else if (percentage >= 60) {
      return {
        level: "Almost Ready",
        icon: Target,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        message: `You're really close to being ready for ${selectedLevel}! You've got a solid foundation, and with just a bit more preparation in a few key areas, you'll be set for success.`,
        recommendations: generatePersonalizedAdvice("Almost Ready")
      };
    } else {
      return {
        level: "Needs More Preparation",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: `You're on the right track, but there's some important groundwork to lay before tackling ${selectedLevel}. Take your time with this preparation - it's all about building a strong, confident partnership with your horse.`,
        recommendations: generatePersonalizedAdvice("Needs More Preparation")
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
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id]);
  const progress = ((currentQuestionIndex + (answers[questions[currentQuestionIndex]?.id] ? 1 : 0)) / questions.length) * 100;
  
  const questionColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

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
                  {levels.map((level, index) => {
                    const colors = [
                      'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
                      'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
                      'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
                      'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                    ];
                    return (
                      <Button
                        key={level.value}
                        size="lg"
                        className={`h-16 text-lg text-white font-semibold transform transition-all duration-200 hover:scale-105 ${colors[index]}`}
                        onClick={() => handleLevelSelect(level.value)}
                      >
                        {level.label}
                      </Button>
                    );
                  })}
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
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${questionColors[currentQuestionIndex]} transition-all duration-700`}>
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <h1 className="text-3xl font-playfair font-bold text-white mb-4">
                  Readiness Assessment for {selectedLevel}
                </h1>
                <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-white/90 text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 transform animate-in slide-in-from-bottom-5 duration-500">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {currentQuestionIndex < 3 ? "🐎" : "👤"}
                  </span>
                </div>
                <CardTitle className="text-2xl text-navy mb-2">
                  {currentQuestionIndex < 3 ? "Horse Questions" : "Rider Questions"}
                </CardTitle>
                <CardDescription className="text-xl font-semibold text-gray-700">
                  {currentQuestion.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, optionIndex) => {
                    const optionColors = [
                      'hover:bg-purple-50 border-purple-200',
                      'hover:bg-blue-50 border-blue-200', 
                      'hover:bg-green-50 border-green-200',
                      'hover:bg-orange-50 border-orange-200'
                    ];
                    
                    return (
                      <div key={option.value} className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-102 ${optionColors[optionIndex]} ${answers[currentQuestion.id] === option.value ? 'ring-2 ring-offset-2 ring-purple-500 bg-purple-50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`${currentQuestion.id}-${option.value}`}
                            className="text-purple-600"
                          />
                          <Label 
                            htmlFor={`${currentQuestion.id}-${option.value}`}
                            className="flex-1 cursor-pointer text-lg font-medium text-gray-700"
                          >
                            {option.label}
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>

                {answers[currentQuestion.id] && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-in fade-in duration-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isLastQuestion ? "Calculating your results..." : "Moving to next question..."}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('level')}
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
              >
                Change Level
              </Button>
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