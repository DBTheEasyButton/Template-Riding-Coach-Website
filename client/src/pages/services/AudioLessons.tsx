import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Check, Clock, MapPin, Wallet, RefreshCw, Play, ArrowRight, Star, Calendar, Download, CheckCircle, Mail, Loader2 } from "lucide-react";
import introAudio from "@assets/From_Strong_to_Light_and_Soft_(in_28_days)_-_TRIAL_LESSON_1766111816502.mp3";

function DownloadProgressOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-navy/95 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-full mb-6">
          <Download className="h-10 w-10 text-orange animate-bounce" />
        </div>
        <h3 className="text-xl font-playfair font-bold text-navy mb-2">
          Your Download Has Started
        </h3>
        <p className="text-gray-600 mb-4">
          Your free audio lesson is downloading now.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-orange h-3 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{progress}%</p>
      </div>
    </div>
  );
}

function AudioLeadCaptureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setShowSuccess(false);
    setShowProgress(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = introAudio;
    link.download = 'From-Strong-to-Light-and-Soft-Trial-Lesson.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free audio lesson.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-capture/strong-horse-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setShowProgress(true);
      triggerDownload();
      
    } catch (error) {
      console.error("Lead capture error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProgressComplete = () => {
    setShowProgress(false);
    setShowSuccess(true);
  };

  if (showProgress) {
    return <DownloadProgressOverlay onComplete={handleProgressComplete} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Your Free Lesson is Ready!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your download has started. You can also listen to the lesson below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-navy rounded-xl p-4 my-6">
              <div className="flex items-center justify-center gap-2 text-white mb-3">
                <Headphones className="h-5 w-5 text-orange" />
                <span className="font-semibold text-sm">Trial Lesson</span>
              </div>
              <audio controls className="w-full" data-testid="audio-intro-lesson">
                <source src={introAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href={introAudio} download="From-Strong-to-Light-and-Soft-Trial-Lesson.mp3">
                <Button className="w-full bg-orange hover:bg-orange-hover text-white" data-testid="button-download-audio-again">
                  <Download className="mr-2 h-4 w-4" />
                  Download Again
                </Button>
              </a>
              <Button variant="outline" onClick={handleClose} data-testid="button-close-audio-modal">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange/10 rounded-full">
                  <Headphones className="h-7 w-7 text-orange" />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                Get Your Free Audio Lesson
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Enter your details and your download will start immediately.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="audio-firstName" className="text-navy font-medium text-sm">
                    First Name
                  </Label>
                  <Input
                    id="audio-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="audio-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="audio-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="audio-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-mobile"
                  className="border-gray-300"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Mail className="h-3 w-3 text-navy mt-0.5 flex-shrink-0" />
                  <span>Your details are safe. I'll only send helpful training tips and clinic updates.</span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3"
                data-testid="button-submit-audio-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free Lesson
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AudioLessons() {
  const testimonials = [
    {
      name: "Claire W.",
      content: "I can finally have a lesson whenever I want! No more waiting weeks for a slot or rushing to get to my trainer. I just pop in my earbuds and ride.",
      rating: 5
    },
    {
      name: "Hannah P.",
      content: "As a busy mum, finding time for lessons was impossible. Now I train with Dan's audio course during my morning rides. Game changer.",
      rating: 5
    },
    {
      name: "Katie R.",
      content: "I've spent so much money on lessons over the years. This audio course has given me more progress than months of weekly lessons.",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <Headphones className="w-8 h-8 text-orange" />,
      title: "Listen While You Ride",
      description: "Get real-time guidance through your earbuds while you're actually in the saddle. No more trying to remember what your instructor said last week."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange" />,
      title: "No Booking Required",
      description: "Train whenever suits you — early morning, late evening, weekends. Your lesson is ready whenever you are, no scheduling required."
    },
    {
      icon: <Wallet className="w-8 h-8 text-orange" />,
      title: "No Weekly Fees",
      description: "Stop the constant drain of weekly lesson costs. Pay once, access forever. Get the same quality coaching without the ongoing expense."
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange" />,
      title: "No Travel Needed",
      description: "Train at your own yard, your own arena, wherever you ride. Save the time, fuel, and stress of travelling to a trainer."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-orange" />,
      title: "Unlimited Replays",
      description: "Repeat any lesson as many times as you need. Master each exercise at your own pace without paying for another session."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange" />,
      title: "Train On Your Schedule",
      description: "Whether you have 20 minutes before work or a full hour on Sunday — you decide when and how long you train."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Download the Lesson",
      description: "Access your audio lessons on your phone. They're designed to play through earbuds while you ride."
    },
    {
      step: "2",
      title: "Tack Up and Mount",
      description: "Get your horse ready as normal. Put in your earbuds (bone conduction headphones work brilliantly for safety)."
    },
    {
      step: "3",
      title: "Press Play and Ride",
      description: "I guide you through exercises in real time. Warm-up, main work, and cool-down — all spoken instructions while you ride."
    },
    {
      step: "4",
      title: "Repeat and Progress",
      description: "Replay lessons as often as you like. Each repetition builds muscle memory and deepens understanding for you and your horse."
    }
  ];

  const faqs = [
    {
      question: "What are the Dan Bizzarro Method audio lessons?",
      answer: "The Dan Bizzarro Method audio lessons are listen-while-you-ride coaching sessions designed to guide you in real time while you are riding. You listen to the lesson during your ride and are coached step by step, just as you would be in a lesson. The guidance helps you understand what you are doing, what you should be feeling, and how to make adjustments as you go. The aim is not just to tell you what to do, but to help you ride with more awareness, clarity, and understanding."
    },
    {
      question: "How do these audio lessons compare to having a lesson in person?",
      answer: "The audio lessons are designed to feel like I am there with you, coaching you through the ride. I guide you step by step, explaining the focus of the session, what to pay attention to, how to recognise changes, and how to respond if something doesn't feel right. Because the coaching happens during the ride, many riders find it feels far more effective than trying to remember instructions afterwards."
    },
    {
      question: "Are these just exercises, or is it real coaching?",
      answer: "These are not just exercise instructions. Each audio lesson is structured like a real coaching session, helping you understand how your horse feels underneath you, recognise why things feel the way they do, and learn how to improve them progressively. The focus is on developing feel, timing, and understanding, not simply riding patterns or movements."
    },
    {
      question: "Do I need to follow the lessons in order?",
      answer: "Yes. Each audio course is designed with a clear sequence, and the lessons are intended to be followed in order. Each one builds on the previous lesson so that understanding and improvement develop logically. Once you have completed a course, you can revisit individual lessons whenever you need them."
    },
    {
      question: "How long are the audio lessons?",
      answer: "Most audio lessons are between 30 and 45 minutes, designed to fit naturally into a normal schooling or focused riding session."
    },
    {
      question: "What do I need to listen to the audio lessons?",
      answer: "The lessons work best if you listen using earphones or AirPods, as this allows you to hear the guidance clearly without distraction. You can also listen through your phone speaker and keep the phone safely in your pocket if needed. The most important thing is that you can hear the instructions clearly while riding."
    },
    {
      question: "Where can I use the audio lessons?",
      answer: "The lessons are primarily designed for flatwork, but many of the principles can be applied in different riding environments. You should always choose a safe and appropriate environment where you can concentrate on your riding and surroundings. Listening in situations that require full attention, such as busy roads or traffic, is not recommended."
    },
    {
      question: "Do I need an arena to use the audio lessons?",
      answer: "No. An arena can be useful, but it is not essential. The lessons are designed to be adaptable and can be used wherever you normally ride, provided the environment is safe and suitable."
    },
    {
      question: "What level of rider are the audio lessons for?",
      answer: "The audio lessons are mainly aimed at amateur riders, but they are not basic. They are suitable for riders who want clearer structure and guidance, want to understand what they are feeling when they ride, and want to improve the quality of their riding over time. You do not need to ride at a specific level to benefit from them."
    },
    {
      question: "Are the audio lessons discipline-specific?",
      answer: "No. The Dan Bizzarro Method is based on general training principles that apply across disciplines. The focus is on how the horse moves, balances, and responds to the rider, regardless of what you ride for."
    },
    {
      question: "Can I use the lessons with more than one horse?",
      answer: "Yes. The principles taught apply to all horses, but you should always adapt your expectations and intensity based on each horse's level, fitness, and training."
    },
    {
      question: "Are the audio lessons suitable for young or inexperienced horses?",
      answer: "Many lessons focus on fundamental training principles, which can be useful for a wide range of horses. It is always the rider's responsibility to decide whether a lesson is appropriate for their horse's age, experience, and physical development."
    },
    {
      question: "What kind of improvements can I expect?",
      answer: "The audio lessons aim to help you better understand how your horse feels and how your riding influences that feeling. Most riders notice improvements in clarity and consistency, communication between horse and rider, and overall quality and ease of the ride. Progress depends on consistency and correct application, but the tools you learn are designed to be long-lasting."
    },
    {
      question: "Will the audio lessons replace live coaching?",
      answer: "No. The audio lessons are designed to support and complement live coaching, not replace it. Many riders find that the lessons help them get more out of in-person coaching because they ride with greater awareness and understanding."
    },
    {
      question: "Is there a time limit on access to the audio lessons?",
      answer: "No. Once you purchase an audio course, you have lifetime access. You can return to the lessons whenever you want or need them."
    },
    {
      question: "What if I don't find the audio lessons useful?",
      answer: "If you complete a course and genuinely feel it hasn't been useful, you can contact me and I will give you a full refund. I want riders to feel confident trying the audio lessons and to only keep them if they genuinely help."
    },
    {
      question: "Are the audio lessons safe to use?",
      answer: "Horse riding always involves risk. The audio lessons are designed to be used in safe, controlled environments. You are responsible for deciding when and where to listen and for prioritising safety at all times."
    },
    {
      question: "Are these audio lessons part of the Dan Bizzarro Method?",
      answer: "Yes. All audio lessons are part of the wider Dan Bizzarro Method, a structured approach to training focused on clarity, balance, and understanding rather than force or shortcuts. The lessons are designed to give you tools you can continue to use long after you finish the course."
    },
    {
      question: "I'm not sure which audio lesson or course to start with. What should I do?",
      answer: "Start with the course that best matches what you want to improve in your riding right now. Over time, the audio lessons are designed to complement each other and build a broader understanding of the method."
    }
  ];

  const [showAudioModal, setShowAudioModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Audio Lessons - Train While You Ride | Dan Bizzarro Method"
        description="Access expert horse training coaching through audio lessons you can listen to while riding. No booking, no travel, no weekly fees — just real-time guidance in your earbuds whenever you want."
        keywords="audio riding lessons, horse training audio course, listen while riding, equestrian audio lessons, Dan Bizzarro audio, online horse training, remote riding coaching"
        canonical="https://danbizzarromethod.com/coaching/audio-lessons"
      />
      <Navigation />
      {/* Hero Section */}
      <section className="relative bg-navy pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Headphones className="h-4 w-4" />
                <span>A New Way to Train</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
                Expert Coaching<br />
                <span className="text-orange">In Your Earbuds</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Listen to professional training guidance while you ride. No booking, no travel, no weekly fees — just real-time instruction whenever you want it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => setShowAudioModal(true)}
                  className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                  data-testid="button-hero-cta"
                >
                  <Headphones className="mr-2 h-5 w-5" />
                  Try a Free Lesson
                </Button>
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    className="bg-white hover:bg-gray-100 text-navy font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-hero-course"
                  >
                    BUY NOW
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">From Strong to Light and Soft</p>
                    <p className="text-gray-400">6-Lesson Audio Course</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Lesson 1: Finding the Balance Point", "Lesson 2: Releasing the Poll", "Lesson 3: Softening the Jaw", "Lesson 4: Creating Forward"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <Play className="h-4 w-4 text-orange" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <span className="text-gray-400 text-sm">+ 2 more lessons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Compact Reviews */}
      <section className="py-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs mb-2 italic leading-relaxed">"{t.content}"</p>
                <p className="font-medium text-navy text-xs">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Problem/Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-6">
            The Problem with Traditional Lessons
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">You love riding, you would love to have more coaching sessions but the traditional lesson model doesn't always fit modern life. Finding a slot, booking weeks ahead, driving to the trainer, paying £50-£100 each time... and by the time you practice again on your own, you've forgotten half of what you learned. There has to be a better way.</p>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-left">
            <h3 className="text-xl font-semibold text-navy mb-4 text-center">Audio Lessons Are the Solution</h3>
            <p className="text-gray-600 mb-4">
              With audio lessons, the coaching comes to you. Pop in your earbuds, press play, and I'll guide you through exercises in real time while you ride.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>No scheduling</strong> — train whenever suits you</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>No travel</strong> — learn at your own yard</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>No ongoing costs</strong> — pay once, keep forever</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Real-time guidance</strong> — coaching while you ride</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Featured Course Box */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-orange px-6 py-3">
              <div className="flex items-center gap-2 text-white">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">Featured Audio Course</span>
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
                From Strong to Light and Soft in 28 Days
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Is your horse heavy in the hand, rushing, or leaning on the bit? This audio course guides you through a proven system to transform your horse's way of going — one ride at a time.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  "6 structured audio lessons",
                  "Listen while you ride",
                  "Progressive exercises over 28 days",
                  "Develop true self-carriage",
                  "Lighten the contact naturally",
                  "Works for all disciplines"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowAudioModal(true)}
                  className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl"
                  data-testid="button-featured-free-lesson"
                >
                  <Headphones className="mr-2 h-5 w-5" />
                  Try a Free Lesson
                </Button>
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    className="bg-navy hover:bg-navy/90 text-white font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-featured-buy"
                  >
                    BUY THE FULL COURSE
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
              Why Riders Love Audio Lessons
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More flexibility, less expense, and coaching you can actually use while you're riding.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-navy mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              How Audio Lessons Work
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              It's as simple as pressing play. Here's what a typical session looks like.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white/10 rounded-xl p-6 h-full">
                  <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-orange/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-navy hover:text-orange">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Headphones className="h-12 w-12 text-orange mx-auto mb-6" />
          <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
            Ready to Try Audio Lessons?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Start with a free lesson from the "From Strong to Light and Soft in 28 Days" course. Experience what it's like to have expert coaching in your ear while you ride.
          </p>
          <Button 
            onClick={() => setShowAudioModal(true)}
            className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-10 text-lg rounded-xl"
            data-testid="button-final-cta"
          >
            <Headphones className="mr-2 h-5 w-5" />
            Get Your Free Audio Lesson
          </Button>
          <p className="mt-6 text-sm text-gray-500">
            By using our audio lessons you agree to our{" "}
            <Link href="/audio-lessons-terms" className="text-orange hover:underline">
              Audio Lessons Terms & Conditions
            </Link>
          </p>
        </div>
      </section>
      <AudioLeadCaptureModal isOpen={showAudioModal} onClose={() => setShowAudioModal(false)} />
      <Footer />
    </div>
  );
}
