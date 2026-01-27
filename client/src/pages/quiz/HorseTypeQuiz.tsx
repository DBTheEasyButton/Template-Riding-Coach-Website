import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ArrowRight, 
  Zap, 
  Brain, 
  Square, 
  Scale,
  ChevronRight,
  Download,
  RotateCcw,
  Heart,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneVerificationField, requiresSmsVerification } from "@/components/PhoneVerificationField";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/logo-light-bg.png";

type ArchetypeKey = "freight_train" | "powerhouse" | "overthinker" | "sofa" | "plank" | "partner";

interface Scores {
  freight_train: number;
  powerhouse: number;
  overthinker: number;
  sofa: number;
  plank: number;
  partner: number;
}

interface Option {
  id: string;
  text: string;
  icon: string;
  scores: Partial<Scores>;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: "q1",
    text: "How does your horse usually feel when you start riding?",
    options: [
      { id: "q1_a", text: "Forward and enthusiastic, like he/she already has a plan.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q1_b", text: "Strong and determined, as if he/she thinks we're late for something.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q1_c", text: "Distracted and busy, taking in everything around us.", icon: "brain", scores: { overthinker: 1 } },
      { id: "q1_d", text: "Steady and relaxed, sometimes needs waking up.", icon: "turtle", scores: { sofa: 1 } }
    ]
  },
  {
    id: "q2",
    text: "What happens when you ask for more trot or canter?",
    options: [
      { id: "q2_a", text: "He/she surges forward more than needed — speed first, balance later.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q2_b", text: "He/she brightens up and goes, but stays rideable.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q2_c", text: "He/she ignores me at first, then eventually responds.", icon: "turtle", scores: { sofa: 1 } },
      { id: "q2_d", text: "He/she responds without rushing or stalling — just a normal transition.", icon: "balance", scores: { partner: 1 } }
    ]
  },
  {
    id: "q3",
    text: "How does your horse respond when you ask him/her to slow down or rebalance?",
    options: [
      { id: "q3_a", text: "He/she leans through the hand and keeps powering on.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q3_b", text: "He/she listens, but would rather keep that engine running.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q3_c", text: "He/she comes back, but mostly because he/she wasn't in a hurry anyway.", icon: "turtle", scores: { sofa: 1 } },
      { id: "q3_d", text: "He/she adjusts without argument and stays with me.", icon: "balance", scores: { partner: 1 } }
    ]
  },
  {
    id: "q4",
    text: "How does the contact usually feel in your hands?",
    options: [
      { id: "q4_a", text: "Heavy, like he/she is leaning on me for balance.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q4_b", text: "Light to nothing, like I'm holding two empty reins.", icon: "turtle", scores: { sofa: 1 } },
      { id: "q4_c", text: "In and out — contact changes with the environment.", icon: "brain", scores: { overthinker: 1 } },
      { id: "q4_d", text: "Consistent and comfortable, not too much or too little.", icon: "balance", scores: { partner: 1 } }
    ]
  },
  {
    id: "q5",
    text: "What does your horse do when something in the environment changes?",
    options: [
      { id: "q5_a", text: "He/she immediately notices and has feelings about it.", icon: "brain", scores: { overthinker: 1 } },
      { id: "q5_b", text: "He/she registers it, but stays focused on the job.", icon: "balance", scores: { partner: 1 } },
      { id: "q5_c", text: "He/she prefers to keep moving rather than stare at it.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q5_d", text: "He/she barely acknowledges it unless it involves food.", icon: "turtle", scores: { sofa: 1 } }
    ]
  },
  {
    id: "q6",
    text: "How easy is it to bend your horse left and right?",
    options: [
      { id: "q6_a", text: "Bending is a negotiation — his/her body feels straight and rigid.", icon: "square", scores: { plank: 1 } },
      { id: "q6_b", text: "He/she can bend, but the brain is often elsewhere.", icon: "brain", scores: { overthinker: 1 } },
      { id: "q6_c", text: "Bending works, but needs reminders to stay loose.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q6_d", text: "Bending feels natural and elastic on both sides.", icon: "balance", scores: { partner: 1 } }
    ]
  },
  {
    id: "q7",
    text: "When you soften your aids (leg or hand), what usually happens?",
    options: [
      { id: "q7_a", text: "He/she takes the gap and rushes off.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q7_b", text: "He/she keeps going but becomes less organised.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q7_c", text: "He/she fades and loses impulsion.", icon: "turtle", scores: { sofa: 1 } },
      { id: "q7_d", text: "He/she maintains rhythm, balance, and direction.", icon: "balance", scores: { partner: 1 } }
    ]
  },
  {
    id: "q8",
    text: "If you jump (or ride poles), how does your horse usually approach the fence?",
    options: [
      { id: "q8_a", text: "Fast and flat, solving problems with speed.", icon: "speed-arrow", scores: { freight_train: 1 } },
      { id: "q8_b", text: "Keen and forward, but listening enough to adjust.", icon: "bolt", scores: { powerhouse: 1 } },
      { id: "q8_c", text: "Hesitant or busy-brained, needs time to assess.", icon: "brain", scores: { overthinker: 1 } },
      { id: "q8_d", text: "Not fussed — jumps/poles feel like just another line of work.", icon: "balance", scores: { partner: 1 } },
      { id: "q8_e", text: "I don't jump / no experience.", icon: "horse", scores: {} }
    ]
  }
];

const archetypes: Record<ArchetypeKey, {
  label: string;
  group: "course" | "pdf" | "none" | "waitlist";
  title: string;
  shortDescription: string;
  headline: string;
  body: string;
  offerText: string;
  ctaLabel: string;
}> = {
  freight_train: {
    label: "The Freight Train",
    group: "course",
    title: "Your Horse is: The Freight Train",
    shortDescription: "Strong in the hand and always thinking forward. He/she uses speed and momentum instead of balance, which makes half-halts, poles, and transitions harder than they should be. When rebalanced, this type becomes powerful and athletic.",
    headline: "Help your Freight Train become light, balanced, and rideable.",
    body: "Your horse has plenty of power, but needs more balance, clarity, and organisation. When those pieces are in place, he/she becomes lighter in the hand and easier to ride in every transition.",
    offerText: "Get a free audio lesson with the first steps to making him/her lighter and softer.",
    ctaLabel: "Send Me the Free Audio Lesson"
  },
  powerhouse: {
    label: "The Powerhouse",
    group: "course",
    title: "Your Horse is: The Powerhouse",
    shortDescription: "Energetic, keen, and ready to work. He/she marches everywhere with a strong engine but can struggle to stay organised, especially when asked to wait or rebalance. Once the energy has structure, this type feels fantastic to ride.",
    headline: "Turn that engine into effortless power.",
    body: "Your horse brings plenty of energy. With better balance and clearer communication, that power becomes easy to manage instead of hard work.",
    offerText: "Get a free audio lesson with the first steps to a lighter, more organised ride.",
    ctaLabel: "Send Me the Free Audio Lesson"
  },
  overthinker: {
    label: "The Overthinker",
    group: "course",
    title: "Your Horse is: The Overthinker",
    shortDescription: "Reactive and busy-minded, constantly scanning and processing the environment. This leaves less bandwidth for relaxing into the contact, bending, or committing to lines. With clarity and routine, the brain settles and the body follows.",
    headline: "Give your Overthinker a calmer job description.",
    body: "Your horse needs clear, consistent riding so the brain can relax and the body can soften. When the questions are simple and fair, he/she finds it much easier to focus.",
    offerText: "Get a free audio lesson that shows how to build clarity and softness step by step.",
    ctaLabel: "Send Me the Free Audio Lesson"
  },
  sofa: {
    label: "The Sofa",
    group: "waitlist",
    title: "Your Horse is: The Sofa",
    shortDescription: "Laid-back and unflappable, this horse is calm and easy-going but can lack energy or responsiveness. Often behind the leg and slow to react. With the right motivation and exercises, he/she can become more forward without losing that lovely temperament.",
    headline: "An audio course designed just for Sofa horses is coming soon!",
    body: "I'm currently developing a dedicated audio course specifically for riders like you — those with wonderful, calm horses who just need a little more spark. This course will give you step-by-step exercises to build responsiveness and forward thinking without losing that lovely temperament.",
    offerText: "Be the first to know when it launches and get exclusive early access.",
    ctaLabel: "I'd love to be the first to try the course!"
  },
  plank: {
    label: "The Plank",
    group: "course",
    title: "Your Horse is: The Plank",
    shortDescription: "Stiff through the body and not naturally elastic. Bending, changing direction, or staying soft in corners can feel mechanical until the body warms up. Suppleness unlocks strength, balance, and rideability.",
    headline: "Help your Plank become supple and rideable.",
    body: "Your horse needs help learning how to use his/her body in a more elastic, balanced way. With better organisation, everything from circles to transitions becomes easier.",
    offerText: "Get a free audio lesson with exercises to build suppleness and softness.",
    ctaLabel: "Send Me the Free Audio Lesson"
  },
  partner: {
    label: "The Partner",
    group: "none",
    title: "Your Horse is: The Partner",
    shortDescription: "Balanced, responsive, and easy to ride. He/she listens, adjusts, and stays with you through transitions and movements. This is what good training looks like — a horse that's truly working with you.",
    headline: "You've got a great partnership.",
    body: "Your horse is already well-balanced and responsive. Keep building on this foundation with progressive training that maintains and develops what you've achieved.",
    offerText: "Stay sharp with advanced exercises and training insights.",
    ctaLabel: "Get Training Tips"
  }
};

function getIcon(iconType: string, className: string = "w-5 h-5") {
  switch (iconType) {
    case "speed-arrow":
      return <ArrowRight className={className} />;
    case "bolt":
      return <Zap className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "turtle":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10c-2 0-3 1-3 3v1h6v-1c0-2-1-3-3-3z"/>
          <ellipse cx="12" cy="14" rx="6" ry="4"/>
          <path d="M6 14l-2 2"/>
          <path d="M18 14l2 2"/>
          <path d="M8 10l-1-2"/>
          <path d="M16 10l1-2"/>
          <circle cx="10" cy="11" r="0.5" fill="currentColor"/>
          <circle cx="14" cy="11" r="0.5" fill="currentColor"/>
        </svg>
      );
    case "square":
      return <Square className={className} />;
    case "balance":
      return <Scale className={className} />;
    case "horse":
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7c3-2 6-2 7 1l1 8 4 3v2h-3l-1-3-4-1v4H5v-4c-2-1-3-4-2-7z"/>
          <path d="M11 8c2-1 4 0 6 2l3-3"/>
          <circle cx="17" cy="5" r="1.5" fill="currentColor"/>
        </svg>
      );
  }
}

function getArchetypeIcon(archetype: ArchetypeKey, className: string = "w-8 h-8") {
  const iconMap: Record<ArchetypeKey, string> = {
    freight_train: "speed-arrow",
    powerhouse: "bolt",
    overthinker: "brain",
    sofa: "turtle",
    plank: "square",
    partner: "balance"
  };
  return getIcon(iconMap[archetype], className);
}

const ARCHETYPE_PRIORITY: ArchetypeKey[] = [
  "freight_train", "powerhouse", "overthinker", "plank", "sofa", "partner"
];

export default function HorseTypeQuiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Scores>({
    freight_train: 0,
    powerhouse: 0,
    overthinker: 0,
    sofa: 0,
    plank: 0,
    partner: 0
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ArchetypeKey | null>(null);
  
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    horseName: ""
  });
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  
  const phoneVerification = usePhoneVerification();
  const needsSmsVerification = requiresSmsVerification(waitlistForm.mobile);
  const isPhoneValid = phoneVerification.isPhoneVerified || (!needsSmsVerification && waitlistForm.mobile.trim().length >= 10);

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);
  
  const handleWaitlistSubmit = async () => {
    if (!waitlistForm.firstName.trim() || !waitlistForm.lastName.trim() || 
        !waitlistForm.email.trim() || !waitlistForm.mobile.trim() || !waitlistForm.horseName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isPhoneValid) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your phone number before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingWaitlist(true);
    
    try {
      const response = await fetch("/api/lazy-horse-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: waitlistForm.firstName.trim(),
          lastName: waitlistForm.lastName.trim(),
          email: waitlistForm.email.trim(),
          phone: waitlistForm.mobile.trim(),
          horseName: waitlistForm.horseName.trim()
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join waitlist");
      }
      
      setWaitlistSuccess(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as the course is ready."
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };
  
  const closeWaitlistModal = () => {
    setShowWaitlistModal(false);
    setWaitlistForm({ firstName: "", lastName: "", email: "", mobile: "", horseName: "" });
    setWaitlistSuccess(false);
    phoneVerification.reset();
  };

  const determineWinningArchetype = (finalScores: Scores): ArchetypeKey => {
    const maxScore = Math.max(...Object.values(finalScores));
    if (maxScore === 0) {
      return "powerhouse";
    }
    const tiedArchetypes = (Object.entries(finalScores) as [ArchetypeKey, number][])
      .filter(([, score]) => score === maxScore)
      .map(([key]) => key);
    
    if (tiedArchetypes.length === 1) {
      return tiedArchetypes[0];
    }
    for (const archetype of ARCHETYPE_PRIORITY) {
      if (tiedArchetypes.includes(archetype)) {
        return archetype;
      }
    }
    return tiedArchetypes[0];
  };

  const handleOptionSelect = (option: Option) => {
    if (isTransitioning) return;
    
    setSelectedOption(option.id);
    setIsTransitioning(true);

    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([key, value]) => {
      if (value) {
        newScores[key as ArchetypeKey] += value;
      }
    });
    setScores(newScores);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      } else {
        const winningArchetype = determineWinningArchetype(newScores);
        setResult(winningArchetype);
        setShowResult(true);
        setIsTransitioning(false);
      }
    }, 400);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScores({
      freight_train: 0,
      powerhouse: 0,
      overthinker: 0,
      sofa: 0,
      plank: 0,
      partner: 0
    });
    setSelectedOption(null);
    setShowResult(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen sm:min-h-screen h-[100dvh] sm:h-auto bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <div className="flex justify-center py-3 sm:py-8 flex-shrink-0">
        <img 
          src={logoPath} 
          alt="Dan Bizzarro Method" 
          className="h-10 sm:h-16 object-contain"
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-4 sm:pb-12 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1"
            >
              <div className="mb-4 sm:mb-8 flex-shrink-0">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-navy">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-1"
                >
                  <h2 className="text-lg sm:text-2xl font-playfair font-bold text-navy mb-3 sm:mb-6 leading-snug sm:leading-relaxed flex-shrink-0">
                    {question.text}
                  </h2>

                  <div className="space-y-2 sm:space-y-3 flex-1">
                    {question.options.map((option, index) => (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isTransitioning}
                        className={`w-full text-left px-3 py-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 flex items-center gap-3 sm:gap-4 group ${
                          selectedOption === option.id
                            ? "border-orange bg-orange/10 shadow-md"
                            : "border-gray-200 hover:border-orange/50 hover:bg-orange/5"
                        } ${isTransitioning && selectedOption !== option.id ? "opacity-50" : ""}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                          selectedOption === option.id
                            ? "bg-orange text-white"
                            : "bg-navy/10 text-navy group-hover:bg-orange/20 group-hover:text-orange"
                        }`}>
                          {getIcon(option.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                        </div>
                        <span className={`text-sm sm:text-lg leading-snug sm:leading-relaxed ${
                          selectedOption === option.id ? "text-navy font-medium" : "text-gray-700"
                        }`}>
                          {option.text}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange/10 text-orange mb-4"
                >
                  {getArchetypeIcon(result, "w-10 h-10")}
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-navy mb-4">
                  {archetypes[result].title}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                  {archetypes[result].shortDescription}
                </p>
              </div>

              <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-3">
                  {archetypes[result].headline}
                </h3>
                <p className="text-white/80 mb-4 leading-relaxed">
                  {archetypes[result].body}
                </p>
                <p className="text-orange font-medium mb-6">
                  {archetypes[result].offerText}
                </p>
                <Button 
                  size="lg"
                  className="bg-orange hover:bg-orange/90 text-white px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg w-full sm:w-auto"
                  onClick={() => {
                    if (archetypes[result].group === "waitlist") {
                      setShowWaitlistModal(true);
                    } else {
                      setLocation("/courses/strong-horse-audio");
                    }
                  }}
                >
                  {archetypes[result].group === "waitlist" ? (
                    <Heart className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : archetypes[result].group === "pdf" ? (
                    <Download className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  <span>{archetypes[result].ctaLabel}</span>
                </Button>
              </div>

              <button
                onClick={handleRestart}
                className="text-gray-500 hover:text-navy flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Take the quiz again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-playfair font-bold text-navy">
                  {waitlistSuccess ? "You're on the list!" : "Join the Waitlist"}
                </h2>
                <button
                  onClick={closeWaitlistModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {waitlistSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    Thanks for your interest! We'll let you know as soon as the course for "Sofa" horses is ready.
                  </p>
                  <Button onClick={closeWaitlistModal} className="bg-navy hover:bg-navy/90">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Be the first to access the new audio course designed specifically for riders with laid-back horses.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="waitlist-firstName" className="text-navy font-medium text-sm">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="waitlist-firstName"
                          value={waitlistForm.firstName}
                          onChange={(e) => setWaitlistForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Your first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="waitlist-lastName" className="text-navy font-medium text-sm">
                          Surname <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="waitlist-lastName"
                          value={waitlistForm.lastName}
                          onChange={(e) => setWaitlistForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Your surname"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="waitlist-email" className="text-navy font-medium text-sm">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="waitlist-email"
                        type="email"
                        value={waitlistForm.email}
                        onChange={(e) => setWaitlistForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <PhoneVerificationField
                      mobile={waitlistForm.mobile}
                      setMobile={(val) => {
                        setWaitlistForm(prev => ({ ...prev, mobile: val }));
                        phoneVerification.handlePhoneChange(val);
                      }}
                      isPhoneVerified={phoneVerification.isPhoneVerified}
                      codeSent={phoneVerification.codeSent}
                      isSendingCode={phoneVerification.isSendingCode}
                      isVerifyingCode={phoneVerification.isVerifyingCode}
                      verificationCode={phoneVerification.verificationCode}
                      verificationError={phoneVerification.verificationError}
                      onSendCode={() => phoneVerification.sendVerificationCode(waitlistForm.mobile)}
                      onVerifyCode={() => phoneVerification.verifyCode(waitlistForm.mobile)}
                      onCodeChange={phoneVerification.setVerificationCode}
                      onPhoneChange={phoneVerification.handlePhoneChange}
                      onReset={phoneVerification.reset}
                      label="Mobile Number"
                    />
                    
                    <div>
                      <Label htmlFor="waitlist-horseName" className="text-navy font-medium text-sm">
                        Horse's Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="waitlist-horseName"
                        value={waitlistForm.horseName}
                        onChange={(e) => setWaitlistForm(prev => ({ ...prev, horseName: e.target.value }))}
                        placeholder="Your horse's name"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button
                      onClick={handleWaitlistSubmit}
                      disabled={isSubmittingWaitlist || !isPhoneValid}
                      className="w-full bg-orange hover:bg-orange/90 text-white py-3"
                    >
                      {isSubmittingWaitlist ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Join the Waitlist
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
