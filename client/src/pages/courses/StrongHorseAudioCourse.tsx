import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, FileText, Clock, Target } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import introAudio from "@assets/Introductory_STRON_HORSE_Audio_Lesson_1766019614594.mp3";
import beforeImage from "@assets/67_1766025322880.png";
import afterImage from "@assets/14_1766025322881.png";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-orange transition-colors"
      >
        <span className="font-semibold text-navy">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

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
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-full mb-6">
          <Download className="h-10 w-10 text-orange animate-bounce" />
        </div>
        <h3 className="text-xl font-playfair font-bold text-navy mb-2">
          Preparing Your Download
        </h3>
        <p className="text-gray-600 mb-6">
          Your free audio lesson is being prepared...
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
    link.download = 'Strong-Horse-Introductory-Lesson.mp3';
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
                <span className="font-semibold text-sm">Introductory Audio Lesson</span>
              </div>
              <audio controls className="w-full" data-testid="audio-intro-lesson">
                <source src={introAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href={introAudio} download="Strong-Horse-Introductory-Lesson.mp3">
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

function PDFLeadCaptureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free PDF guide.",
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
      const response = await fetch("/api/lead-capture/strong-horse-pdf", {
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'The-Strong-Horse-Solution-Dan-Bizzarro.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setShowSuccess(true);
      
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
                Your PDF Guide is Ready!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your download has started. Check your downloads folder for the PDF.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <Button variant="outline" onClick={handleClose} className="w-full" data-testid="button-close-pdf-modal">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                Get Your Free PDF Guide
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                "The Strong Horse Solution" - Enter your details to download.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pdf-firstName" className="text-navy font-medium text-sm">
                    First Name
                  </Label>
                  <Input
                    id="pdf-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-pdf-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="pdf-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-pdf-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="pdf-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-pdf-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="pdf-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-pdf-mobile"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                data-testid="button-submit-pdf-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free PDF
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

export default function StrongHorseAudioCourse() {
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHead
        title="From Strong to Light and Soft (in No Time) - Audio Course | Dan Bizzarro Method"
        description="Transform your strong, heavy or rushing horse with this 6-lesson audio course. Learn the proven system for creating balance, softness and control — listen while you groom, drive, or prepare for your ride."
        canonical="/courses/strong-horse-audio"
      />
      <Navigation />
      <AudioLeadCaptureModal isOpen={showAudioModal} onClose={() => setShowAudioModal(false)} />
      <PDFLeadCaptureModal isOpen={showPDFModal} onClose={() => setShowPDFModal(false)} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-navy via-slate-800 to-navy text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  6-Lesson Audio Course
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">
                  From Strong to Light and Soft <span className="text-orange">(in No Time)</span>
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  The complete audio training that transforms heavy, rushing horses into soft, balanced, rideable partners — listen while you groom, drive, or prepare for your ride.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Headphones className="h-5 w-5 text-orange" />
                    <span>6 Audio Lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-5 w-5 text-orange" />
                    <span>~180 Minutes Total</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="h-5 w-5 text-orange" />
                    <span>Proven Method</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-orange">
                  <p className="text-gray-200 italic">
                    "A strong horse doesn't become light by being held. It becomes light when the communication becomes clear."
                  </p>
                  <p className="text-orange font-semibold mt-2">— Dan Bizzarro</p>
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-playfair font-bold text-navy mb-2">Start Learning Now</h2>
                  <p className="text-gray-600">
                    Choose your free resource to get started right away.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => setShowAudioModal(true)}
                    className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-6 text-lg rounded-xl"
                    data-testid="button-get-free-lesson"
                  >
                    <Headphones className="mr-3 h-6 w-6" />
                    Get Free Audio Lesson
                  </Button>

                  <Button
                    onClick={() => setShowPDFModal(true)}
                    variant="outline"
                    className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-6 text-lg rounded-xl"
                    data-testid="button-get-free-pdf"
                  >
                    <FileText className="mr-3 h-6 w-6" />
                    Get Free PDF Guide
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant download • No payment required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4 text-center">
              The Transformation
            </h2>
            <p className="text-gray-600 text-lg text-center mb-10">
              See the difference when a horse learns to carry itself in balance.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold z-10 shadow-lg">
                  Before
                </div>
                <img 
                  src={beforeImage} 
                  alt="Horse rushing and on the forehand" 
                  className="w-full h-72 object-cover rounded-xl shadow-lg"
                />
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium text-center">
                    Heavy on the forehand, rushing, pulling against the rider
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold z-10 shadow-lg">
                  After
                </div>
                <img 
                  src={afterImage} 
                  alt="Horse balanced and soft in the contact" 
                  className="w-full h-72 object-cover rounded-xl shadow-lg"
                />
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium text-center">
                    Balanced, soft in the contact, listening to the rider
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              Does This Sound Like Your Horse?
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Leans heavily on your hands",
                  "Gets faster the more you try to slow down",
                  "Rushes into or away from jumps",
                  "Ignores your half-halts",
                  "Feels out of control in canter",
                  "Gets stronger when nervous or excited"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-navy font-semibold text-lg">
                  These aren't behaviour problems. They're balance problems.
                </p>
                <p className="text-gray-600 mt-2">
                  And balance problems have a simple solution — when you know how.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE TRANSFORMATION */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-10 text-center">
              What Changes When You Apply This System
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🙋</span> For You:
                </h3>
                <div className="space-y-3">
                  {[
                    "Feel calmer and more in control",
                    "Know exactly what to do when the horse gets strong",
                    "Spend less time fighting, more time riding",
                    "Clearer, more effective aids",
                    "Confidence that comes from predictability"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🐴</span> For Your Horse:
                </h3>
                <div className="space-y-3">
                  {[
                    "Softer, more relaxed neck",
                    "Lighter, more comfortable contact",
                    "Better natural balance",
                    "Quicker, clearer responses",
                    "Less rushing, leaning and pulling"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY AUDIO */}
        <section className="py-16 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Headphones className="h-12 w-12 text-orange mx-auto mb-4" />
              <h2 className="text-3xl font-playfair font-bold mb-4">
                Why an Audio Course?
              </h2>
              <p className="text-gray-300 text-lg">
                Because learning happens best when it fits your life.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "While You Groom",
                  description: "Listen as you prepare your horse, so the ideas are fresh when you mount."
                },
                {
                  title: "On the Drive",
                  description: "Turn travel time into training time — arrive at the yard ready to ride."
                },
                {
                  title: "Before Your Lesson",
                  description: "Quick refresh on key concepts so you're focused and prepared."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-orange mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6">
              Ready to Start?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Get your free introductory lesson and start transforming your riding today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowAudioModal(true)}
                className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl"
                data-testid="button-get-free-lesson-bottom"
              >
                <Headphones className="mr-2 h-5 w-5" />
                Get Free Audio Lesson
              </Button>

              <Button
                onClick={() => setShowPDFModal(true)}
                variant="outline"
                className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-4 px-8 text-lg rounded-xl"
                data-testid="button-get-free-pdf-bottom"
              >
                <FileText className="mr-2 h-5 w-5" />
                Get Free PDF Guide
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <FAQItem 
                question="Is this course suitable for all riding disciplines?"
                answer="Yes! While I specialise in show jumping and eventing, the principles in this course apply to any discipline. Whether you ride dressage, hack out, or compete cross country — a strong horse is a strong horse, and the solution is the same."
              />
              <FAQItem 
                question="How long before I see results?"
                answer="Most riders notice a difference within their first few sessions of applying these techniques. The key is consistency — small, daily changes add up to major transformations."
              />
              <FAQItem 
                question="Is the free lesson really free?"
                answer="Absolutely. No payment details required. I want you to experience the quality of the training before you commit to anything. If you find value in it, the full course will be available soon."
              />
              <FAQItem 
                question="Can I listen while riding?"
                answer="The lessons are designed to be absorbed before you ride — while grooming, driving, or preparing. That way, the concepts are fresh in your mind when you mount up. I don't recommend listening while actually riding for safety reasons."
              />
              <FAQItem 
                question="Will this work for my young/green horse?"
                answer="Yes, in fact it's even more effective with younger horses because you're building good habits from the start rather than undoing old ones. The principles work for horses of all ages and experience levels."
              />
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
