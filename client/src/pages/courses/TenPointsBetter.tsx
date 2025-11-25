import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Target, 
  CheckCircle2, 
  Play, 
  Headphones, 
  Award, 
  Clock, 
  Download, 
  ShieldCheck,
  CircleDot,
  Square,
  ArrowRight,
  Footprints,
  BookOpen,
  Eye,
  Zap,
  Star,
  Users,
  MapPin,
  Gift,
  Loader2
} from "lucide-react";
import danPhotoPath from "@assets/optimized/13_1749386080915.jpg";
import dressageHeroJpg from "@assets/optimized/dressage-hero.jpg";
import dressageHeroWebp from "@assets/optimized/dressage-hero.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";

export default function TenPointsBetter() {
  const seoConfig = getSEOConfig('/courses/10-points-better');
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const signupMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string }) => {
      return apiRequest("POST", "/api/audio-trial/signup", data);
    },
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Please fill in all fields",
        description: "We need your name and email to send you the free lesson.",
        variant: "destructive"
      });
      return;
    }
    signupMutation.mutate(formData);
  };

  const openModal = () => {
    setShowSuccess(false);
    setIsModalOpen(true);
  };

  const painPoints = [
    "You feel like you try your hardest but never seem to get the result you want in dressage.",
    "You've trained for hours, but transitions still feel rushed or sluggish.",
    "You've memorised the test, but the moment you enter the ring, nerves undo your preparation.",
    'You hear "more impulsion" or "needs balance" but don\'t know how to fix it.',
    "Your warm-ups always feel rushed, you can't find a routine that actually settles you in.",
    "You struggle to maintain straightness and accuracy through your dressage movements."
  ];

  const lessons = [
    {
      number: 1,
      title: "Ride the Lines Like a Pro",
      icon: <ArrowRight className="w-8 h-8" />,
      description: "Master straight lines, corners and diagonals with precision. Learn how to ensure your horse is straight and responsive through every movement.",
      type: "Mounted Ride-Along"
    },
    {
      number: 2,
      title: "The 20m Circle, Nailed",
      icon: <CircleDot className="w-8 h-8" />,
      description: "Use precision markers to ride perfect geometry every time. Develop bend from the inside leg whilst maintaining rhythm and balance.",
      type: "Mounted Ride-Along"
    },
    {
      number: 3,
      title: "The Magic of the 20m Square",
      icon: <Square className="w-8 h-8" />,
      description: "Dan's go-to exercise for developing suppleness and corner strength. A simple shape that transforms your horse's responsiveness and your alignment.",
      type: "Mounted Ride-Along"
    },
    {
      number: 4,
      title: "Transitions Done Right",
      icon: <Zap className="w-8 h-8" />,
      description: "Spiral and leg-yielding techniques that sharpen your horse's responsiveness and improve balance. The key to clean, precise transitions.",
      type: "Mounted Ride-Along"
    },
    {
      number: 5,
      title: "The Walk: Your Most Underrated Gait",
      icon: <Footprints className="w-8 h-8" />,
      description: "Fix common walk issues and encourage stretch into the contact. Help tense horses relax and score higher in this often-overlooked gait.",
      type: "Mounted Ride-Along"
    },
    {
      number: 6,
      title: "Test Riding 101",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Break down each movement and learn to read the test as a rider—not just what the test says, but what it actually means. Strategic preparation that wins points.",
      type: "Unmounted Lecture"
    },
    {
      number: 7,
      title: "Reading the Test Like a Judge",
      icon: <Eye className="w-8 h-8" />,
      description: "Interpret every movement from a judge's perspective. Understand exactly what earns points and what costs them—before you enter the arena.",
      type: "Unmounted Lecture"
    },
    {
      number: 8,
      title: "Pre-Test Warm-Up Routine",
      icon: <Target className="w-8 h-8" />,
      description: "Follow Dan's ride-along warm-up for optimal bend, balance and relaxation. Includes mindset cues to help you enter the arena confident and focused.",
      type: "Mounted Ride-Along"
    }
  ];

  const bonuses = [
    {
      title: "20m Circle Diagram with Cone Placement",
      value: "£15",
      description: "Print-ready guide showing exactly where to place markers for perfect circles"
    },
    {
      title: "20m Square Turning Zones Guide",
      value: "£15",
      description: "Visual reference for Dan's signature suppleness exercise"
    },
    {
      title: "Rider Movement Checklist",
      value: "£10",
      description: "Quick-reference checklist for every movement in your test"
    },
    {
      title: "Lifetime Access via Ride IQ",
      value: "Included",
      description: "Listen whilst you ride, whenever you want, forever"
    }
  ];

  const testimonials = [
    {
      quote: "Dan's teaching style is so clear and practical. He breaks everything down in a way that just makes sense when you're actually riding.",
      name: "Sophie",
      location: "Oxfordshire",
      discipline: "BE80 Eventer"
    },
    {
      quote: "I went from feeling like I was guessing what the judges wanted to actually understanding how to present each movement. Game changer.",
      name: "Emma",
      location: "Gloucestershire",
      discipline: "Novice Eventer"
    },
    {
      quote: "The ride-along format is brilliant. Having Dan's voice in my ear whilst I'm actually on my horse makes all the difference.",
      name: "Charlotte",
      location: "Berkshire",
      discipline: "Starter Level"
    }
  ];

  const faqs = [
    {
      question: "Who is this course for?",
      answer: "This course is designed specifically for amateur eventing riders at Starter, Beginner Novice, and Novice levels. You don't need any advanced experience—just a desire to improve your dressage scores and ride with more confidence and precision."
    },
    {
      question: "Do I need to ride at a specific venue or arena?",
      answer: "Not at all. The audio lessons are designed to work in any standard arena. Dan uses generalised references that apply whether you're in a 20x40m or 20x60m arena. The downloadable diagrams help you set up cone markers wherever you ride."
    },
    {
      question: "When will the course be available?",
      answer: "The 10 Points Better course launches in early 2026 through Ride IQ. Join the waitlist now to be the first to know when it goes live and to secure early-bird pricing."
    },
    {
      question: "How long are the lessons?",
      answer: "Each mounted ride-along lesson is approximately 20-30 minutes—perfect for a focused schooling session. The unmounted lectures are 15-20 minutes, designed for efficient learning before you head to the yard."
    },
    {
      question: "What equipment do I need?",
      answer: "You'll need your phone or a Bluetooth speaker to play the audio whilst riding, and any standard arena with space to set out a few cones or markers. The downloadable diagrams show you exactly where to place them."
    },
    {
      question: "What if I'm not satisfied with the course?",
      answer: "We offer a 30-day satisfaction guarantee. If you don't feel your dressage riding has improved after completing the course, contact us for a full refund—no questions asked."
    },
    {
      question: "How is this different from watching YouTube videos?",
      answer: "Unlike videos, this is an audio ride-along course. Dan coaches you in real-time whilst you're actually on your horse, giving you instructions as you ride. It's like having Dan in the arena with you, guiding every movement."
    },
    {
      question: "Can I use this course for pure dressage, not just eventing?",
      answer: "Absolutely. Whilst designed with eventers in mind, the principles of geometry, accuracy, and test preparation apply equally to pure dressage riders at Intro to Novice level."
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        preloadImage={dressageHeroWebp}
        preloadImageJpeg={dressageHeroJpg}
      />
      
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Top: Badge and Title (centered) */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Headphones className="w-4 h-4" />
              <span>Audio Course • Coming Early 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Score <span className="text-orange">10 Points Better</span> in Your Next Dressage Test
            </h1>
          </div>
          
          {/* Bottom: Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Description, buttons, and features */}
            <div className="space-y-8">
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                An 8-lesson audio course designed for Starter - Novice eventing riders to master transitions, straightness, suppleness, accuracy and show preparation - whilst you're actually in the saddle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange hover:bg-orange/90 text-white text-lg px-8 py-6"
                  onClick={openModal}
                  data-testid="button-hero-cta"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Try it for free now
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-navy hover:bg-gray-100 text-lg px-8 py-6 font-semibold"
                  onClick={() => scrollToSection('lessons')}
                  data-testid="button-see-lessons"
                >
                  See What's Inside
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>6 Mounted Ride-Alongs</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>2 Unmounted Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Downloadable Diagrams</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
            
            {/* Right: Hero Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <HeroPicture
                  jpegSrc={dressageHeroJpg}
                  webpSrc={dressageHeroWebp}
                  alt="Dressage rider performing a precise movement in the arena - the Dan Bizzarro Method transforms your test scores"
                  loading="eager"
                  priority={true}
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-orange/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Dan Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={danPhotoPath} 
                alt="Dan Bizzarro - International Event Rider and Coach"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-4 -right-4 bg-orange text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">20+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy">
                Meet Your Coach: Dan Bizzarro
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Dan Bizzarro is an Italian international event rider who began riding at nine years old. After moving from Italy to England, he trained under Olympic medallist William Fox-Pitt—one of the most successful British event riders of all time.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                In 2024, Dan was shortlisted for the Paris Olympic Games, and he has represented Italy in numerous Nations Cup events. Now based in Oxfordshire, Dan is passionate about helping riders of all levels achieve their potential through clear, practical coaching.
              </p>
              
              <blockquote className="border-l-4 border-orange pl-6 py-2 italic text-gray-700">
                "I created this course because I see so many riders losing easy points on simple things—geometry, straightness, test preparation. These are skills you can learn, and once you know them, those 10 points are yours for life."
              </blockquote>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-5 h-5 text-orange" />
                  <span>Olympic Shortlist 2024</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-orange" />
                  <span>Nations Cup Rider</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-orange" />
                  <span>Based in Oxfordshire</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-8">
            Sound Familiar?
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">✅</span>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <p className="text-xl lg:text-2xl font-semibold text-navy max-w-2xl mx-auto">
              What if you could follow a plan, love schooling, and score 10 points better in only 2 weeks?
            </p>
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <section id="lessons" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              The 10 Points Better System
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              8 carefully structured lessons that take you from uncertainty to confidence. Listen whilst you ride and transform your dressage scores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <div 
                key={lesson.number}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-navy/5 flex items-center justify-center text-navy flex-shrink-0">
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-orange">Lesson {lesson.number}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {lesson.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">{lesson.title}</h3>
                    <p className="text-gray-600">{lesson.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => scrollToSection('pricing')}
              data-testid="button-lessons-cta"
            >
              Get Instant Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Value Stack & Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Everything You Need to Score 10 Points Better
            </h2>
            <p className="text-lg text-gray-600">
              A complete system for transforming your dressage riding
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-navy to-slate-800 rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                <span>Early Bird Special</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">10 Points Better Audio Course</h3>
              <p className="text-gray-300">Available Early 2026 via Ride IQ</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span>6 Mounted Ride-Along Audio Lessons</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span>2 Unmounted Strategy Lectures</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span>Downloadable Arena Diagrams & Checklists</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span>Lifetime Access via Ride IQ App</span>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 mb-8">
              <p className="text-sm text-gray-400 mb-2">Plus, these exclusive bonuses:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{bonus.title}</span>
                      <span className="text-emerald-400 text-sm">
                        {bonus.value === "Included" ? "✓ Included" : `Value: ${bonus.value}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{bonus.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-orange hover:bg-orange/90 text-white text-lg px-12 py-6 w-full sm:w-auto"
                onClick={openModal}
                data-testid="button-pricing-cta"
              >
                <Gift className="w-5 h-5 mr-2" />
                Try it for free now
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                Get a full free lesson sent to your inbox. No payment required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              What Riders Say About Dan's Coaching
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-md"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange text-orange" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-bold text-navy">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location} • {testimonial.discipline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-gray-50 rounded-lg px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-12 h-12 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-navy mb-4">
                30-Day Satisfaction Guarantee
              </h2>
              <p className="text-lg text-gray-600">
                Complete the course and put it into practice. If you don't feel your dressage riding has genuinely improved within 30 days, we'll refund your purchase in full—no questions asked. Your success is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Score 10 Points Better?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Try a full lesson for free and experience Dan's proven system for transforming your dressage scores.
          </p>
          
          <Button 
            size="lg" 
            className="bg-orange hover:bg-orange/90 text-white text-lg px-12 py-6"
            onClick={openModal}
            data-testid="button-final-cta"
          >
            <Gift className="w-5 h-5 mr-2" />
            Try it for free now
          </Button>
          
          <p className="text-gray-400 mt-6 text-sm">
            Get a full lesson sent to your inbox. No payment required.
          </p>
        </div>
      </section>

      {/* Free Trial Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {showSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-navy mb-2">
                  You're in!
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Check your inbox - your free lesson is on its way. We can't wait for you to experience the Dan Bizzarro Method.
                </DialogDescription>
              </DialogHeader>
              <Button 
                className="mt-6 bg-navy hover:bg-navy/90"
                onClick={() => setIsModalOpen(false)}
              >
                Got it
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-navy">
                  Try a full lesson for free
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  We'll send you a complete audio lesson from the course - no strings attached. Experience Dan's coaching style and see how it can transform your dressage scores.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Surname</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your surname"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange hover:bg-orange/90 text-white py-6"
                  disabled={signupMutation.isPending}
                  data-testid="button-submit-trial"
                >
                  {signupMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Send me the free lesson
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
